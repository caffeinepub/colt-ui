import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type CursorStyle = {
    #neonDot;
    #crosshair;
    #ringPulse;
    #starBurst;
    #arrowGlow;
  };

  public type BackgroundStyle = {
    #particleGrid;
    #neonRain;
    #matrixCode;
    #starfield;
    #solidDark;
    #cyberHexGrid;
    #neonCity;
    #spaceNebula;
    #cyberForest;
    #abstractGlitch;
    #darkOcean;
  };

  public type FontStyle = {
    #pressStart2P;
    #orbitron;
    #rajdhani;
    #monospace;
    #sansSerif;
  };

  public type TabCloakPreset = {
    #default;
    #google;
    #clever;
    #googleClassroom;
    #youtube;
  };

  public type Preferences = {
    lastActiveTab : Text;
    accentColor : Text;
    notepad : Text;
    cursorStyle : CursorStyle;
    backgroundStyle : BackgroundStyle;
    fontStyle : FontStyle;
    cloakPreset : TabCloakPreset;
  };

  public type UserProfile = {
    name : Text;
  };

  let preferencesMap = Map.empty<Principal, Preferences>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let cCoinsBalances = Map.empty<Principal, Nat>(); // Stores user C Coins balances
  let purchasedEffectsMap = Map.empty<Principal, Set.Set<Text>>(); // Stores user-purchased visual effects

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

  public shared ({ caller }) func savePreferences(
    lastActiveTab : Text,
    accentColor : Text,
    cursorStyle : CursorStyle,
    backgroundStyle : BackgroundStyle,
    fontStyle : FontStyle,
    cloakPreset : TabCloakPreset,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save preferences");
    };
    switch ((lastActiveTab, accentColor, cursorStyle, backgroundStyle, fontStyle, cloakPreset)) {
      case (_, _, _, _, _, _) {
        switch (preferencesMap.get(caller)) {
          case (?existing) {
            let updatedPrefs = {
              lastActiveTab;
              accentColor;
              notepad = existing.notepad;
              cursorStyle;
              backgroundStyle;
              fontStyle;
              cloakPreset;
            };
            preferencesMap.add(caller, updatedPrefs);
          };
          case (null) {
            let newPrefs : Preferences = {
              lastActiveTab;
              accentColor;
              notepad = "";
              cursorStyle;
              backgroundStyle;
              fontStyle;
              cloakPreset;
            };
            preferencesMap.add(caller, newPrefs);
          };
        };
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
          cursorStyle = existing.cursorStyle;
          backgroundStyle = existing.backgroundStyle;
          fontStyle = existing.fontStyle;
          cloakPreset = existing.cloakPreset;
        };
        preferencesMap.add(caller, updatedPrefs);
      };
      case (null) {
        let pivotPrefs : Preferences = {
          lastActiveTab = "home";
          accentColor = "default";
          notepad;
          cursorStyle = #neonDot; // Default cursor
          backgroundStyle = #particleGrid; // Default background
          fontStyle = #orbitron; // Default font
          cloakPreset = #default; // Default cloak
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

  public shared ({ caller }) func getCCoins() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get C Coin balance");
    };
    switch (cCoinsBalances.get(caller)) {
      case (null) {
        let newBalance = 2000; // Initialize new users with 2000 C Coins
        cCoinsBalances.add(caller, newBalance);
        newBalance;
      };
      case (?balance) { balance };
    };
  };

  public shared ({ caller }) func spendCCoins(amount : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can spend C Coins");
    };

    switch (cCoinsBalances.get(caller)) {
      case (null) {
        if (amount <= 2000) {
          let newBalance = 2000 - amount;
          cCoinsBalances.add(caller, newBalance);
          true;
        } else { false };
      };
      case (?balance) {
        if (balance >= amount) {
          let newBalance = balance - amount;
          cCoinsBalances.add(caller, newBalance);
          true;
        } else { false };
      };
    };
  };

  public shared ({ caller }) func addCCoins(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add C Coins");
    };

    switch (cCoinsBalances.get(caller)) {
      case (null) {
        let newBalance = 2000 + amount; // Initialize new users with 2000 C Coins
        cCoinsBalances.add(caller, newBalance);
      };
      case (?balance) {
        let newBalance = balance + amount;
        cCoinsBalances.add(caller, newBalance);
      };
    };
  };

  public shared ({ caller }) func setPurchasedEffects(effects : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set purchased effects");
    };

    let effectsSet = Set.fromIter(effects.values());
    purchasedEffectsMap.add(caller, effectsSet);
  };

  public shared ({ caller }) func getPurchasedEffects() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get purchased effects");
    };

    switch (purchasedEffectsMap.get(caller)) {
      case (null) { [] };
      case (?effectsSet) { effectsSet.toArray() };
    };
  };
};

