import { normalizeText } from './helpers';

export function checkAnswer(
  userAnswer: string, 
  correctAnswer: string,
  alternativeAnswer?: string
): boolean {
  const normalizedUser = normalizeText(userAnswer);
  const normalizedCorrect = normalizeText(correctAnswer);
  
  if (normalizedUser === normalizedCorrect) {
    return true;
  }
  
  // Check alternative answer (e.g., without pronoun for Czech)
  if (alternativeAnswer) {
    return normalizedUser === normalizeText(alternativeAnswer);
  }
  
  return false;
}

