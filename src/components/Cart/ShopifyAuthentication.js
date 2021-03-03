import React from 'react';
import useGlobal from "./CartState";
import styled from 'styled-components';
import { Dialog } from "@reach/dialog";

const Grid = styled.div`
`;
const Row = styled.div`
  display: flex;
`;
const Col = styled.div`
  flex: ${(props) => props.size};
`;
const StyledDialog = styled(Dialog)`
width: 20vw;
@media (max-width: 600px) {
  width: 90vw;
  padding: 1.5rem;
  margin: 11vh auto 5vh auto;
}
`;

const ShopifyAuthentication = () => {

    const [globalState, globalActions] = useGlobal();

    const [createEmail, setCreateEmail] = React.useState("");
    const [createPassword, setCreatePassword] = React.useState("");
    const [createFirstname, setCreateFirstname] = React.useState("");
    const [createLastname, setCreateLastname] = React.useState("");
    const [createPhone, setCreatePhone] = React.useState("");
    const [findEmail, setFindEmail] = React.useState("");
    const [findPassword, setFindPassword] = React.useState("");

    const testuser = {
        "email": "user@example.com",
        "password": "HiZqFuDvDdQ7",
    }

    const registerUser = () => {
        const user = {
            "email": createEmail,
            "password": createPassword,
            "firstName": createFirstname,
            "lastName": createLastname,
            "phone": createPhone
        }
        globalActions.registerUser(user);
        setCreateEmail("");
        setCreatePassword("");
        setCreateFirstname("");
        setCreateLastname("");
        setCreatePhone("");
    }

    const signinUser = () => {
        const user = {
            "email": findEmail,
            "password": findPassword,
        }
        globalActions.signinUser(user);
        setFindEmail("");
        setFindPassword("");
    }

    const signoutUser = () => {                
        globalActions.signoutUser()
    }

    return (
        <>
        <StyledDialog isOpen={globalState.isRegisterDialogOpen} onDismiss={globalActions.closeRegisterDialog}>
            <button className="close-button" onClick={globalActions.closeRegisterDialog} style={{ float: "right", cursor: "pointer" }}>
                <span aria-hidden>X</span>
            </button>
            <Grid>
                <Row>
                    <Col><i>{globalState.authMessage}</i><br /></Col>
                </Row>

                {globalState.authenticated &&
                    <Row style={{ justifyContent: "flex-end" }}>
                        <Col>
                            <span>Logged in as '{globalState.user.email}' &nsbp;&nsbp;</span>
                            <input type="button" value="Logout" className="button" onClick={signoutUser} />
                        </Col>
                    </Row>
                }
                {!globalState.authenticated &&
                    <>
                        <Row>
                            <Col size={2}>
                                <Row><Col><h2>Sign Up</h2></Col></Row>
                                <Row>
                                    <Col>Email:<br /><input type="email" value={createEmail} onChange={e => setCreateEmail(e.target.value)} /></Col>
                                </Row>
                                <Row>
                                    <Col>Password:<br /><input type="password" value={createPassword} onChange={e => setCreatePassword(e.target.value)} /></Col>
                                </Row>
                                {/* <Row>
                                    <Col>Firstname:<br /><input type="text" value={createFirstname} onChange={e => setCreateFirstname(e.target.value)} /></Col>
                                </Row>
                                <Row>
                                    <Col>Lastname:<br /><input type="text" value={createLastname} onChange={e => setCreateLastname(e.target.value)} /></Col>
                                </Row>
                                <Row>
                                    <Col>Phonenumber:<br /><input type="number" value={createPhone} onChange={e => setCreatePhone(e.target.value)} /></Col>
                                </Row> */}
                                <Row>
                                    <Col style={{ paddingTop: "0.5rem" }}><input className="button" type="button" value="SIGNUP" onClick={registerUser} /></Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
            </Grid>
        </StyledDialog>
        <StyledDialog isOpen={globalState.isAuthDialogOpen} onDismiss={globalActions.closeAuthDialog}>
            <button className="close-button" onClick={globalActions.closeAuthDialog} style={{ float: "right", cursor: "pointer" }}>
                <span aria-hidden>X</span>
            </button>
            <Grid>
                <Row>
                    <Col><i>{globalState.authMessage}</i><br /></Col>
                </Row>

                {globalState.authenticated &&
                    <Row style={{ justifyContent: "flex-end" }}>
                        <Col>
                            <span>Logged in as '{globalState.user.email}' &nsbp;&nsbp;</span>
                            <input type="button" value="Logout" className="button" onClick={signoutUser} />
                        </Col>
                    </Row>
                }
                {!globalState.authenticated &&
                    <>
                        <Row>
                            <Col size={2}>
                                <Row><Col><h2>Login Customer</h2></Col></Row>
                                <Row>
                                    <Col>Email:<br /><input type="text" value={findEmail} onChange={e => setFindEmail(e.target.value)} /></Col>
                                </Row>
                                <Row>
                                    <Col>Password:<br /><input type="password" value={findPassword} onChange={e => setFindPassword(e.target.value)} /></Col>
                                </Row>
                                <Row>
                                    <Col style={{ paddingTop: "0.5rem" }}><input className="button" type="button" value="LOGIN" onClick={signinUser} /></Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
            </Grid>
        </StyledDialog>
        </>
    )
};

export default ShopifyAuthentication;