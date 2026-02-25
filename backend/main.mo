import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Preferences = {
    lastActiveTab : Text;
    accentColor : Text;
    notepad : Text;
  };

  type UserProfile = {
    name : Text;
  };

  let preferencesMap = Map.empty<Principal, Preferences>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func savePreferences(lastActiveTab : Text, accentColor : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save preferences");
    };
    switch (preferencesMap.get(caller)) {
      case (?existing) {
        let updatedPrefs = {
          lastActiveTab;
          accentColor;
          notepad = existing.notepad;
        };
        preferencesMap.add(caller, updatedPrefs);
      };
      case (null) {
        let newPrefs : Preferences = {
          lastActiveTab;
          accentColor;
          notepad = "";
        };
        preferencesMap.add(caller, newPrefs);
      };
    };
  };

  public shared ({ caller }) func saveNotepad(notepad : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save notepad content");
    };
    switch (preferencesMap.get(caller)) {
      case (?existing) {
        let updatedPrefs = {
          lastActiveTab = existing.lastActiveTab;
          accentColor = existing.accentColor;
          notepad;
        };
        preferencesMap.add(caller, updatedPrefs);
      };
      case (null) {
        let pivotPrefs : Preferences = {
          lastActiveTab = "home";
          accentColor = "default";
          notepad;
        };
        preferencesMap.add(caller, pivotPrefs);
      };
    };
  };

  public query ({ caller }) func getPreferences() : async Preferences {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get preferences");
    };
    switch (preferencesMap.get(caller)) {
      case (null) { Runtime.trap("No preferences found") };
      case (?prefs) { prefs };
    };
  };
};
