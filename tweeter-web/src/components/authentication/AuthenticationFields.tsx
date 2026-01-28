import { ChangeEvent } from "react";

interface Props {
  alias: string;
  password: string;
  onAliasChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEnter: () => void;
}

const AuthenticationFields = (props: Props) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter") {
      props.onEnter();
    }
  };

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={handleKeyDown}
          onChange={(e) => props.onAliasChange(e.target.value)}
          value={props.alias}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>

      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={handleKeyDown}
          onChange={(e) => props.onPasswordChange(e.target.value)}
          value={props.password}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
