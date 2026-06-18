# TrustNet AI: Dataset Preprocessing Report

This report outlines text cleaning and tokenization steps applied before fitting ML vectorizers:

## Preprocessing Protocol
1.  **Lowercasing**: Standardizes vocabulary casing.
2.  **Emoji & Punctuation Stripping**: Cleans special chars using regular expression `[^\w\s\d]`.
3.  **Space Normalization**: Compresses multiple whitespace delimiters.
4.  **Hinglish Normalization**: Standardizes spelling variations of common regional words:
    *   *kamayein* -> *kamaye*
    *   *rozana* -> *daily*
    *   *paisey* -> *paisa*
    *   *jeeta* -> *won*
    *   *mubarak* -> *congratulations*
    *   *turant* -> *urgent*
5.  **Lexical Extraction**: Compiles URL indicators (length, special character ratios, entropy) into flat feature matrices.
