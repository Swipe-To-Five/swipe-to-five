export const accountErrorToString = (error: string): string => {
  switch (error) {
    case 'ACCOUNT_ALREADY_EXISTS': {
      return 'Account already exists for this email address';
    }
    default: {
      return 'Something went wrong, please try again later.';
    }
  }
};

