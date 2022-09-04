import { RECRUITEE } from './constants/roles.constants';
import { CreateAccountDto } from './dtos/auth/create-account.dto';
import { createNewAccount } from './services/auth.service';

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
    </div>
  );
};

export default App;

