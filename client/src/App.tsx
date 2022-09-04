import { RECRUITEE } from './constants/roles.constants';
import { CreateAccountDto } from './dtos/auth/create-account.dto';
import { LoginAccountDto } from './dtos/auth/login-account.dto';
import { createNewAccount, loginAccount } from './services/auth.service';

const App = () => {
  return (
    <div>
      <h1>Hello World!!</h1>
      <button
        onClick={async () => {
          const account = await createNewAccount(
            new CreateAccountDto('example@example.com', 'example', RECRUITEE)
          );

          console.log(account);
        }}
      >
        Register
      </button>
      <button
        onClick={async () => {
          await loginAccount(
            new LoginAccountDto('example@example.com', 'example', 'WEB')
          );
        }}
      >
        Login
      </button>
    </div>
  );
};

export default App;

