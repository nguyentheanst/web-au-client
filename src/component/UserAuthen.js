import React, { useState } from "react";
import { assertionFinish, assertionStart } from "../service/assertion";
import base64url from "base64url";

const UserAuthen = () => {
  const [name, setName] = useState("");
  const [authenticationResult, setAuthenticationResult] = useState({
    status: 1,
    message: "",
  });

  const authenticate = async () => {
    try {
      const { data } = await assertionStart(name);
      console.log(data);
      const publicKeyCredentials = data;
      publicKeyCredentials.credentialOptions.challenge = base64url.toBuffer(
        publicKeyCredentials.credentialOptions.challenge
      );
      if (publicKeyCredentials.credentialOptions.allowCredentials) {
        publicKeyCredentials.credentialOptions.allowCredentials =
          publicKeyCredentials.credentialOptions.allowCredentials.map((ac) => {
            const obj = Object.assign({}, ac);
            obj.id = base64url.toBuffer(obj.id);
            return obj;
          });
      }

      const cred = await navigator.credentials.get({
        publicKey: publicKeyCredentials.credentialOptions,
      });
      const credential = {};
      credential.id = cred.id;
      credential.rawId = base64url.encode(cred.rawId);
      credential.type = cred.type;

      if (cred.getClientExtensionsResults) {
        credential.clientExtensionResults = cred.getClientExtensionsResults();
      } else {
        credential.clientExtensionResults = {};
      }

      if (cred.response) {
        credential.response = {
          authenticatorData: base64url.encode(cred.response.authenticatorData),
          clientDataJSON: base64url.encode(cred.response.clientDataJSON),
          signature: base64url.encode(cred.response.signature),
          userHandle: cred.response.userHandle
            ? base64url.encode(cred.response.userHandle)
            : null,
        };
      }

      publicKeyCredentials.credential = credential;
      await assertionFinish(publicKeyCredentials);

      setAuthenticationResult({
        status: 0,
        message: "Authentication Successful",
      });
    } catch (e) {
      setAuthenticationResult({ message: e.message, status: 1 });
    }
  };

  const onAuthenticateClick = (e) => {
    e.preventDefault();
    setAuthenticationResult({ status: 1, message: "" });
    authenticate();
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  return (
    <div>
      <form>
        <h3>Authentication</h3>
        <div>
          <label>Name</label>
          <input value={name} type="text" onChange={handleInputChange} />
          <button onClick={onAuthenticateClick}>Authenticate</button>
        </div>
      </form>
      <div>{authenticationResult.message}</div>
    </div>
  );
};

export default UserAuthen;
