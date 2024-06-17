import { useState } from 'react';
import './App.css';

// ЗАДАЧА:
// Создать мини-приложение, где есть форма, в которой
// текстовый инпут и селект.
// Из селекта можно выбрать тип: "user" или "repo".
//
// В зависимости от того, что выбрано в селекте,
// при отправке формы приложение делает запрос
// на один из следующих эндпоинтов:
//
// https://api.github.com/users/${nickname}
// пример значений: defunkt, ktsn, jjenzz, ChALkeR, Haroenv
//
// https://api.github.com/repos/${repo}
// пример значений: nodejs/node, radix-ui/primitives, sveltejs/svelte
//
// после чего, в списке ниже выводится полученная информация;
// - если это юзер, то его full name и число репозиториев;
// - если это репозиторий, то его название и число звезд.

// ТРЕБОВАНИЯ К ВЫПОЛНЕНИЮ:
// - Типизация всех элементов.
// - Выполнение всего задания в одном файле App.tsx, НО с дроблением на компоненты.
// - Стилизовать или использовать UI-киты не нужно. В задаче важно правильно выстроить логику и смоделировать данные.
// - Задание требуется выполнить максимально правильным образом, как если бы вам нужно было, чтобы оно прошло код ревью и попало в продакшн.

// Все вопросы по заданию и результаты его выполнения присылать сюда - https://t.me/temamint

interface RequestFormProps {
  onSubmit: (request: string, selectValue: string) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [request, setRequest] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('users/');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(request, selectValue);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRequest(event.target.value);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={request}
        placeholder="введите запрос"
        onChange={handleInputChange}
      />
      <select onChange={handleSelectChange} name="" id="">
        <option value="users/">user</option>
        <option value="repos/">repo</option>
      </select>
      <button type="submit">Отправить</button>
    </form>
  );
};

interface ResponseDisplayProps {
  otvet: any;
  selectValue: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  otvet,
  selectValue,
}) => {
  if (selectValue === 'users/') {
    return (
      <div>
        <h3>Users</h3>
        {Array.isArray(otvet) ? (
          otvet.map((user: any) => (
            <div key={user.id}>
              <p>Login: {user.login}</p>
              <p>Public repo: {otvet.public_repos}</p>
            </div>
          ))
        ) : (
          <div>
            <p>Login: {otvet.login}</p>
            <p>Public repo: {otvet.public_repos}</p>
          </div>
        )}
      </div>
    );
  } else if (selectValue === 'repos/') {
    return (
      <div>
        <h3>Repositories</h3>
        {Array.isArray(otvet) ? (
          otvet.map((repo: any) => (
            <div key={repo.id}>
              <p>Public repo: {otvet.public_repos}</p>
              <p>stargazers_count: {repo.stargazers_count}</p>
            </div>
          ))
        ) : (
          <div>
            <p>Full Name: {otvet.full_name}</p>
            <p>stargazers_count: {otvet.stargazers_count}</p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const App: React.FC = () => {
  const [otvet, setOtvet] = useState<any>([]);
  const [selectValue, setSelectValue] = useState<string>('users/');

  const getApiData = async (request: string, selectValue: string) => {
    const response = await fetch(
      `https://api.github.com/${selectValue}${request}`
    ).then((response) => response.json());
    setOtvet(response);
    setSelectValue(selectValue);
  };

  return (
    <>
      <RequestForm onSubmit={getApiData} />
      <ResponseDisplay otvet={otvet} selectValue={selectValue} />
    </>
  );
};

export default App;
