import { GrammaticalCase, Gender, Number as GrammaticalNumber } from '@/types';

export interface DeclensionEngine {
  getDefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number?: GrammaticalNumber
  ): string;

  getIndefiniteArticle(
    grammaticalCase: GrammaticalCase,
    gender: Gender
  ): string;

  declineAdjective(
    adjective: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number?: GrammaticalNumber,
    hasDefiniteArticle?: boolean
  ): string;

  declinePossessive(
    possessive: string,
    grammaticalCase: GrammaticalCase,
    gender: Gender,
    number?: GrammaticalNumber
  ): string;

  conjugateVerb(
    pronoun: string,
    verb: string
  ): string;

  translatePronounToEnglish(pronoun: string): string;
  translatePossessiveToEnglish(possessive: string): string;
}

