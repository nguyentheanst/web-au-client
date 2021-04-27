import React, { useState } from "react";
import { registrationFinish, registrationStart } from "../service/registration";
import base64url from "base64url";

const UserRegister = () => {
  const [deviceRegistrationState, setDeviceRegistrationState] = useState({
    message: "",
  });
  const [name, setName] = useState("");

  const createCredential = (publicKeyCredentials) => {
    publicKeyCredentials.creationOptions.challenge = base64url.toBuffer(
      publicKeyCredentials.creationOptions.challenge
    );

    publicKeyCredentials.creationOptions.user.id = base64url.toBuffer(
      publicKeyCredentials.creationOptions.user.id
    );

    if (publicKeyCredentials.creationOptions.excludeCredentials) {
      publicKeyCredentials.creationOptions.excludeCredentials =
        publicKeyCredentials.creationOptions.excludeCredentials.map((ec) => {
          const obj = Object.assign({}, ec);
          obj.id = base64url.toBuffer(obj.id);
          return obj;
        });
    }

    navigator.credentials
      .create({ publicKey: publicKeyCredentials.creationOptions })
      .then((cred) => {
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
          const clientDataJSON = base64url.encode(cred.response.clientDataJSON);
          const attestationObject = base64url.encode(
            cred.response.attestationObject
          );
          credential.response = {
            clientDataJSON,
            attestationObject,
          };
        }

        publicKeyCredentials.credential = credential;

        registrationFinish(publicKeyCredentials)
          .then(() => {
            setDeviceRegistrationState({
              status: 0,
              message: "Device successfully registered",
            });
          })
          .catch((err) => {
            setDeviceRegistrationState({ status: 1, message: err.message });
          });
        // send attestation response and client extensions
        // to the server to proceed with the registration
        // of the credential
      })
      .catch((err) => {
        setDeviceRegistrationState({ status: 1, message: err.message });
      });
  };

  const registerAuthenticator = () => {
    registrationStart(name)
      .then((response) => {
        createCredential(response.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data) {
          setDeviceRegistrationState({
            status: 1,
            message: `${err.response.data.error}`,
          });
        } else {
          setDeviceRegistrationState({
            status: 1,
            message: `${err.message}`,
          });
        }
      });
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onRegisterAuthenticatorClick = (e) => {
    e.preventDefault();
    registerAuthenticator();
  };

  return (
    <form className="measure" key="registration_authenticator_form">
      <h3>Register</h3>
      <div key="ppp">
        <label>Name </label>
        <input value={name} type="text" onChange={handleTextChange} />
        <button onClick={onRegisterAuthenticatorClick}>Register</button>
      </div>
      <div> {deviceRegistrationState.message}</div>
    </form>
  );
};

export default UserRegister;
