import { publicServer } from './../constants/server.constant';
import { Account } from '../models/account.model';
import { CreateAccountDto } from '../dtos/auth/create-account.dto';
import { checkForException } from '../exceptions/server.exception';
import {
  accountErrorToString,
  authErrorToString,
} from '../util/error-string.util';
import { AxiosError } from 'axios';
import { LoginAccountDto } from '../dtos/auth/login-account.dto';

/**
 * Service Implementation for account registration.
 * @param createAccountDto DTO Implementation for account registration.
 * @returns Newly created account details.
 */
export const createNewAccount = async (
  createAccountDto: CreateAccountDto
): Promise<Account> => {
  try {
    // Send a request to the server for new account creation.
    const response = await publicServer.post(
      'v1/account',
      createAccountDto.toJson()
    );

    // Fetching data from the response.
    const { data } = response;

    // Returning account object based on response json.
    return Account.fromJson(data);
  } catch (error) {
    // Check if error type is AxiosError.
    if (error instanceof AxiosError) {
      // Fetch the error response from the server.
      const errorResponse = error.response;

      // Fetch the type of exception based on error status code.
      const serverException = checkForException(errorResponse?.status!);

      // If there is a server specific error, handle it.
      if (serverException) {
        // Fetch the human langauge from the server message.
        const message = accountErrorToString(errorResponse?.data['message']);

        // Throw new error.
        throw serverException(message);
      }
    }

    // Else throw the error forward.
    throw error;
  }
};

/**
 * Service Implementation for account login.
 * @param loginAccountDto DTO Implementation for account login.
 */
export const loginAccount = async (
  loginAccountDto: LoginAccountDto
): Promise<void> => {
  try {
    // Send a request to the server for access and refresh tokens.
    const response = await publicServer.post(
      'v1/auth/login',
      loginAccountDto.toJson()
    );

    // Fetching tokens from the response.
    const { data } = response;
    const { accessToken, refreshToken } = data;

    // Saving tokens in the local storage.
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    // Check if error type is AxiosError.
    if (error instanceof AxiosError) {
      // Fetch the error response from the server.
      const errorResponse = error.response;

      // Fetch the type of exception based on error status code.
      const serverException = checkForException(errorResponse?.status!);

      // If there is a server specific error, handle it.
      if (serverException) {
        // Fetch the human langauge from the server message.
        const message = authErrorToString(errorResponse?.data['message']);

        // Throw new error.
        throw serverException(message);
      }
    }

    // Else throw the error forward.
    throw error;
  }
};

