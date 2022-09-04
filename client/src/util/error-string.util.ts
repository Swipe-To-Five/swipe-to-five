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

export const authErrorToString = (error: string): string => {
  switch (error) {
    case 'ACCOUNT_DOES_NOT_EXISTS': {
      return 'Account does not exists for this email address';
    }
    case 'WRONG_PASSWORD': {
      return 'You have entered a wrong password';
    }
    default: {
      return 'Something went wrong, please try again later.';
    }
  }
};

