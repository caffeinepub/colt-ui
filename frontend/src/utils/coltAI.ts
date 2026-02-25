const historyQA: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['first president', 'george washington'], answer: 'George Washington was the first President of the United States, serving from 1789 to 1797.' },
  { keywords: ['civil war'], answer: 'The American Civil War was fought from 1861 to 1865 between the Union (North) and the Confederacy (South), primarily over slavery and states\' rights. The Union won.' },
  { keywords: ['world war 2', 'world war ii', 'ww2', 'wwii'], answer: 'World War II lasted from 1939 to 1945. It involved most of the world\'s nations and ended with the defeat of Nazi Germany and Imperial Japan. The US entered after the attack on Pearl Harbor in 1941.' },
  { keywords: ['world war 1', 'world war i', 'ww1', 'wwi'], answer: 'World War I lasted from 1914 to 1918. It was triggered by the assassination of Archduke Franz Ferdinand and involved major European powers. The Allied Powers defeated the Central Powers.' },
  { keywords: ['declaration of independence'], answer: 'The Declaration of Independence was adopted on July 4, 1776. It declared the 13 American colonies independent from Britain and was primarily written by Thomas Jefferson.' },
  { keywords: ['abraham lincoln'], answer: 'Abraham Lincoln was the 16th President of the United States (1861–1865). He led the country through the Civil War and issued the Emancipation Proclamation, which declared enslaved people in Confederate states to be free.' },
  { keywords: ['columbus', '1492'], answer: 'Christopher Columbus sailed to the Americas in 1492, landing in the Caribbean. He was sponsored by Spain and made four voyages to the Americas.' },
  { keywords: ['french revolution'], answer: 'The French Revolution (1789–1799) was a period of radical political and social transformation in France. It ended the monarchy, established a republic, and led to Napoleon Bonaparte\'s rise to power.' },
  { keywords: ['martin luther king', 'mlk'], answer: 'Martin Luther King Jr. was a civil rights leader who advocated for racial equality through nonviolent protest. He delivered the famous "I Have a Dream" speech in 1963 and was assassinated in 1968.' },
  { keywords: ['moon landing', 'apollo 11'], answer: 'Apollo 11 landed on the Moon on July 20, 1969. Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon, while Michael Collins orbited above.' },
  { keywords: ['constitution'], answer: 'The U.S. Constitution was ratified in 1788 and is the supreme law of the United States. It established the three branches of government: legislative, executive, and judicial.' },
  { keywords: ['slavery', 'emancipation'], answer: 'Slavery in the United States was abolished by the 13th Amendment in 1865, following the Civil War. The Emancipation Proclamation in 1863 had declared enslaved people in Confederate states free.' },
];

const scienceQA: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['photosynthesis'], answer: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose. The formula is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.' },
  { keywords: ['gravity'], answer: 'Gravity is a fundamental force that attracts objects with mass toward each other. On Earth, gravity accelerates objects at 9.8 m/s². It was described by Newton\'s Law of Universal Gravitation and later by Einstein\'s General Theory of Relativity.' },
  { keywords: ['atom', 'atomic'], answer: 'An atom is the basic unit of matter. It consists of a nucleus (containing protons and neutrons) surrounded by electrons. The number of protons determines the element.' },
  { keywords: ['dna'], answer: 'DNA (Deoxyribonucleic Acid) is the molecule that carries genetic information in living organisms. It has a double helix structure and is made up of four bases: Adenine, Thymine, Guanine, and Cytosine.' },
  { keywords: ['cell', 'cells'], answer: 'Cells are the basic structural and functional units of life. There are two main types: prokaryotic (no nucleus, like bacteria) and eukaryotic (with a nucleus, like plant and animal cells).' },
  { keywords: ['evolution'], answer: 'Evolution is the process of change in all forms of life over generations. Charles Darwin\'s theory of natural selection explains how organisms with favorable traits are more likely to survive and reproduce.' },
  { keywords: ['newton', 'laws of motion'], answer: 'Newton\'s Three Laws of Motion: 1) An object at rest stays at rest unless acted upon by a force. 2) F = ma (Force equals mass times acceleration). 3) For every action, there is an equal and opposite reaction.' },
  { keywords: ['periodic table', 'element'], answer: 'The periodic table organizes all known chemical elements by atomic number. Elements in the same column (group) share similar properties. There are 118 known elements.' },
  { keywords: ['ecosystem'], answer: 'An ecosystem is a community of living organisms interacting with their physical environment. It includes producers (plants), consumers (animals), and decomposers (fungi, bacteria).' },
  { keywords: ['mitosis'], answer: 'Mitosis is the process of cell division that produces two identical daughter cells. It has four phases: Prophase, Metaphase, Anaphase, and Telophase (PMAT).' },
  { keywords: ['speed of light'], answer: 'The speed of light in a vacuum is approximately 299,792,458 meters per second (about 3 × 10⁸ m/s). Nothing with mass can travel at or faster than the speed of light.' },
  { keywords: ['water', 'h2o'], answer: 'Water (H₂O) is a molecule made of two hydrogen atoms and one oxygen atom. It covers about 71% of Earth\'s surface and is essential for all known life.' },
];

const grammarQA: Array<{ keywords: string[]; answer: string }> = [
  { keywords: ['metaphor'], answer: 'A metaphor is a figure of speech that directly compares two unlike things without using "like" or "as." Example: "Life is a journey." It implies one thing IS another.' },
  { keywords: ['simile'], answer: 'A simile is a figure of speech that compares two things using "like" or "as." Example: "She runs like the wind" or "He is as brave as a lion."' },
  { keywords: ['noun'], answer: 'A noun is a word that names a person, place, thing, or idea. Examples: teacher, city, book, happiness. Nouns can be common (dog) or proper (Fido).' },
  { keywords: ['verb'], answer: 'A verb is a word that expresses an action, occurrence, or state of being. Examples: run, think, is, become. Every sentence needs a verb.' },
  { keywords: ['adjective'], answer: 'An adjective is a word that describes or modifies a noun. Examples: tall, blue, happy, three. Adjectives answer questions like "What kind?" or "How many?"' },
  { keywords: ['adverb'], answer: 'An adverb modifies a verb, adjective, or another adverb. Many end in "-ly." Examples: quickly, very, well, often. They answer "How?", "When?", "Where?", or "To what extent?"' },
  { keywords: ['alliteration'], answer: 'Alliteration is the repetition of the same consonant sound at the beginning of nearby words. Example: "Peter Piper picked a peck of pickled peppers."' },
  { keywords: ['hyperbole'], answer: 'Hyperbole is an extreme exaggeration used for emphasis or humor. Example: "I\'ve told you a million times!" It is not meant to be taken literally.' },
  { keywords: ['theme'], answer: 'The theme of a story is the central message or lesson the author wants to convey. It is different from the plot (what happens) — the theme is the deeper meaning, like "courage" or "friendship."' },
  { keywords: ['protagonist'], answer: 'The protagonist is the main character of a story — the one the story follows and who faces the central conflict. The antagonist is the character or force that opposes the protagonist.' },
  { keywords: ['foreshadowing'], answer: 'Foreshadowing is a literary device where the author gives hints or clues about what will happen later in the story. It builds suspense and prepares the reader for future events.' },
  { keywords: ['irony'], answer: 'Irony is when the opposite of what is expected happens or is said. There are three types: verbal irony (saying the opposite of what you mean), situational irony (unexpected outcomes), and dramatic irony (audience knows something characters don\'t).' },
];

function tryMath(message: string): string | null {
  const msg = message.trim();

  // Try to solve simple arithmetic
  const arithmeticMatch = msg.match(/^[\d\s\+\-\*\/\(\)\.]+$/);
  if (arithmeticMatch) {
    try {
      // Safe eval for arithmetic only
      const sanitized = msg.replace(/[^0-9+\-*/().\s]/g, '');
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${sanitized}`)();
      if (typeof result === 'number' && isFinite(result)) {
        return `The answer is **${result}**.`;
      }
    } catch {
      // fall through
    }
  }

  // Linear equation: ax + b = c
  const linearMatch = msg.match(/(-?\d*\.?\d*)\s*x\s*([+\-]\s*\d+\.?\d*)?\s*=\s*(-?\d+\.?\d*)/i);
  if (linearMatch) {
    const a = parseFloat(linearMatch[1] || '1') || 1;
    const b = linearMatch[2] ? parseFloat(linearMatch[2].replace(/\s/g, '')) : 0;
    const c = parseFloat(linearMatch[3]);
    const x = (c - b) / a;
    return `Solving for x:\n${a}x + ${b} = ${c}\n${a}x = ${c - b}\nx = ${x.toFixed(4).replace(/\.?0+$/, '')}`;
  }

  // Quadratic: ax^2 + bx + c = 0
  const quadMatch = msg.match(/(-?\d*\.?\d*)\s*x\^?2\s*([+\-]\s*\d*\.?\d*\s*x)?\s*([+\-]\s*\d+\.?\d*)?\s*=\s*0/i);
  if (quadMatch) {
    const a = parseFloat(quadMatch[1] || '1') || 1;
    const bStr = quadMatch[2] ? quadMatch[2].replace(/x/i, '').replace(/\s/g, '') : '0';
    const b = parseFloat(bStr) || 0;
    const cStr = quadMatch[3] ? quadMatch[3].replace(/\s/g, '') : '0';
    const c = parseFloat(cStr) || 0;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return `For ${a}x² + ${b}x + ${c} = 0, the discriminant is negative (${discriminant}), so there are no real solutions.`;
    }
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    if (x1 === x2) return `x = ${x1.toFixed(4).replace(/\.?0+$/, '')} (one solution)`;
    return `x₁ = ${x1.toFixed(4).replace(/\.?0+$/, '')}, x₂ = ${x2.toFixed(4).replace(/\.?0+$/, '')}`;
  }

  // Percentage
  const percentMatch = msg.match(/what\s+is\s+(\d+\.?\d*)\s*%\s+of\s+(\d+\.?\d*)/i);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const num = parseFloat(percentMatch[2]);
    return `${pct}% of ${num} = ${(pct / 100) * num}`;
  }

  // Area of circle
  const circleMatch = msg.match(/area\s+of\s+(?:a\s+)?circle\s+(?:with\s+)?(?:radius|r)\s*=?\s*(\d+\.?\d*)/i);
  if (circleMatch) {
    const r = parseFloat(circleMatch[1]);
    return `Area of circle with radius ${r} = π × r² = ${(Math.PI * r * r).toFixed(4)}`;
  }

  // Pythagorean theorem
  const pythagoreanMatch = msg.match(/(?:pythagorean|hypotenuse).*?a\s*=\s*(\d+\.?\d*).*?b\s*=\s*(\d+\.?\d*)/i);
  if (pythagoreanMatch) {
    const a = parseFloat(pythagoreanMatch[1]);
    const b = parseFloat(pythagoreanMatch[2]);
    const c = Math.sqrt(a * a + b * b);
    return `Using the Pythagorean theorem: c² = a² + b²\nc = √(${a}² + ${b}²) = √${a * a + b * b} ≈ ${c.toFixed(4)}`;
  }

  // Keywords for math help
  const mathKeywords = ['solve', 'calculate', 'compute', 'math', 'equation', 'algebra', 'geometry', 'fraction', 'decimal', 'multiply', 'divide', 'add', 'subtract', 'square root', 'exponent', 'factor'];
  if (mathKeywords.some(k => msg.toLowerCase().includes(k))) {
    return `I can help with math! Try asking me:\n• Simple arithmetic: "2 + 2", "15 * 7"\n• Linear equations: "2x + 5 = 15"\n• Quadratic equations: "x^2 - 5x + 6 = 0"\n• Percentages: "What is 20% of 150?"\n• Pythagorean theorem: "hypotenuse a=3 b=4"`;
  }

  return null;
}

export function respondToMessage(message: string): string {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|howdy|sup|what'?s up)\b/.test(lower)) {
    return "Hello! I'm Colt AI, your study assistant! I can help you with:\n📐 **Math** - arithmetic, algebra, geometry\n📜 **History** - US and world history\n📝 **English** - grammar, literary devices\n🔬 **Science** - biology, physics, chemistry\n\nWhat would you like to learn today?";
  }

  // Math detection
  const mathResult = tryMath(message);
  if (mathResult) return mathResult;

  // History
  for (const qa of historyQA) {
    if (qa.keywords.some(k => lower.includes(k))) {
      return qa.answer;
    }
  }

  // Science
  for (const qa of scienceQA) {
    if (qa.keywords.some(k => lower.includes(k))) {
      return qa.answer;
    }
  }

  // Grammar/English
  for (const qa of grammarQA) {
    if (qa.keywords.some(k => lower.includes(k))) {
      return qa.answer;
    }
  }

  // Subject-specific fallbacks
  if (/\bmath\b|arithmetic|algebra|geometry|calculus|trigonometry/.test(lower)) {
    return "I can help with math! Try:\n• Arithmetic: \"15 * 7\"\n• Linear equations: \"3x + 6 = 21\"\n• Percentages: \"What is 25% of 80?\"\n• Quadratic: \"x^2 - 4 = 0\"";
  }
  if (/\bhistory\b|historical|war|president|revolution|century/.test(lower)) {
    return "I can help with history! Try asking about:\n• US Presidents (e.g., \"Who was Abraham Lincoln?\")\n• Wars (e.g., \"Tell me about World War 2\")\n• Revolutions (e.g., \"What was the French Revolution?\")\n• Important events (e.g., \"What was the Declaration of Independence?\")";
  }
  if (/\benglish\b|grammar|writing|essay|literature|poem|story/.test(lower)) {
    return "I can help with English! Try asking about:\n• Literary devices (e.g., \"What is a metaphor?\")\n• Parts of speech (e.g., \"What is an adjective?\")\n• Story elements (e.g., \"What is foreshadowing?\")\n• Writing techniques (e.g., \"What is irony?\")";
  }
  if (/\bscience\b|biology|chemistry|physics|earth science/.test(lower)) {
    return "I can help with science! Try asking about:\n• Biology (e.g., \"What is photosynthesis?\")\n• Physics (e.g., \"What are Newton's laws?\")\n• Chemistry (e.g., \"What is an atom?\")\n• Earth science (e.g., \"What is an ecosystem?\")";
  }

  return "I'm not sure about that one! I specialize in:\n📐 **Math** - Try: \"Solve 2x + 5 = 15\"\n📜 **History** - Try: \"Who was Abraham Lincoln?\"\n📝 **English** - Try: \"What is a metaphor?\"\n🔬 **Science** - Try: \"What is photosynthesis?\"\n\nAsk me anything in these subjects!";
}
