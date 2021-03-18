import AdminDashboard from 'Components/AdminDashboard/AdminDashboard';
import Cart from 'Pages/Cart/Cart';
import EmailConfirmation from 'Pages/EmailConfirmation/EmailConfirmation';
import Footer from 'Components/Footer/Footer';
import GetEmailForForgetPassword from 'Pages/ForgetPassword/GetEmailForForgetPassword';
import Home from 'Pages/Home/Home';
import Loader from 'react-spinners/ClipLoader';
import LoadingComponent from 'Shared/LoadingComponent';
import Login from 'Pages/Login/Login';
import Navbar from 'Components/Navbar/Navbar';
import OneOrder from 'Pages/OneOrder/OneOrder';
import Orders from 'Pages/Orders/Orders';
import Register from 'Pages/Register/Register';
import SetNewPassword from 'Pages/ForgetPassword/SetNewPassword';
import SetupService from 'Pages/SetupService/SetupService';
import Sidebar from 'Components/SideBar/Sidebar';
import styled from 'styled-components';
import SuitableVendor from 'Pages/SuitableVendor/SuitableVendor';
import TabbedOrders from 'Components/TabbedOrders/TabbedOrders';
import TabSettings from 'Pages/TabSettings/TabSettings';
import TermsAndConditions from 'Pages/TermsAndConditions/TermsAndConditions';
import TestComponent from 'Components/TestComponent/TextComponent';
import ToolsForm from 'Components/ToolsForm/ToolsForm';
import UserProfile from 'Pages/UserProfile/UserProfile';
import VendorDashboard from 'Pages/VendorDashboard/VendorDashboard';
import ViewVendor from 'Pages/ViewVendor/ViewVendor';
import { CapabilitiesContext } from 'Context/CapabilitiesContext';
import { CapabilityContextType, UserContextType } from 'Utils/types';
import { fetchUser } from 'Utils/QueryFunctions';
import { Suspense, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useQuery } from 'react-query';
import { user } from 'Utils/Interface';
import { UserContext } from 'Context/UserContext';
import Test from 'Components/Test/Test';

const BodyContainer = styled.div`
    width: 100%;
    display: flex;
    flex: 1;
    margin-top: var(--navbar-height);

    & > div:not(:nth-child(1)) {
        margin-left: var(--sidebar-width);
    }
`;

const AppContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
`;

/**
 * App Component
 */
export default function App() {
    const [user, setUser] = useContext<UserContextType>(UserContext);
    const [, setCapabilities] = useContext<CapabilityContextType>(CapabilitiesContext);
    const [suitableVendors, setSuitableVendors] = useState<user[]>();

    const { isLoading, data, error } = useQuery<user>(['user'], fetchUser, {
        retry: false,
        refetchOnWindowFocus: false,
        onError: () => {
            localStorage.removeItem('authorization');
        },
    });

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data, setUser, error]);

    useEffect(() => {
        if (user?.capabilities) {
            const { capabilities } = user;
            setCapabilities((_prev) => {
                const newCap = [...capabilities];
                return newCap;
            });
        }
    }, [user, setCapabilities]);

    if (isLoading) {
        return (

            <AppContainer>
                <Loader loading={isLoading} size={100} color={'#2176FF'}></Loader>
            </AppContainer>
        );
    }

    return (
    <div>
        {/* <Test/> */}
        <AppContainer>
            {!user ? (
                <>
                    <Navbar loading={isLoading} style={{ height: '80px' }} />
                    <Switch>
                        <Route exact path="/">
                            <Home
                                useSuitableVendors={[suitableVendors, setSuitableVendors]}
                                user={user}
                                loading={isLoading}
                            />
                        </Route>
                        <Suspense fallback={<LoadingComponent />}>
                            <Route exact path="/suitable-vendors">
                                <SuitableVendor useSuitableVendors={[suitableVendors, setSuitableVendors]} />
                            </Route>
                            <Route path="/viewVendor/:vendor" exact>
                                <ViewVendor />
                            </Route>
                            <Route exact path="/cart">
                                <Cart useSuitableVendors={[suitableVendors, setSuitableVendors]} />
                            </Route>
                            <Route exact path="/user/email-confirmation/:webtoken" component={EmailConfirmation} />
                            <Route exact path="/:userType/register">
                                <Register />
                            </Route>
                            <Route exact path="/:userType/register/step-2/:email">
                                <Register />
                            </Route>
                            <Route exact path="/login">
                            <Test/>
                                <Login />
                                
                            </Route>
                            <Route exact path="/forget-password" component={GetEmailForForgetPassword} />
                            <Route exact path="/user/set-password/:webtoken" component={SetNewPassword} />
                            <Route path="/terms-and-conditions" exact>
                                <TermsAndConditions />
                            </Route>
                            <Route path="/test">
                                <Test />
                            </Route>
                        </Suspense>
                    </Switch>
                    <Footer />
                </>
            ) : (
                <>
                    {user && user.userType === 'vendor' && (
                        <>
                            <Navbar hideLogo={true} />
                            <BodyContainer>
                                <Sidebar />
                                <Switch>
                                    <Route exact path="/">
                                        <Home
                                            useSuitableVendors={[suitableVendors, setSuitableVendors]}
                                            user={user}
                                            loading={isLoading}
                                        />
                                    </Route>
                                    <Route exact path="/vendor/:vendorId/dashboard">
                                        <VendorDashboard loading={isLoading} />
                                    </Route>
                                    <Suspense fallback={<LoadingComponent />}>
                                        <Route exact path="/vendor/:vendorId/tools">
                                            <ToolsForm />
                                        </Route>
                                        <Route exact path="/vendor/:vendorId/setup">
                                            {!isLoading && !user.setupService ? <SetupService /> : <TabSettings />}
                                        </Route>
                                        <Route exact path="/vendor/:vendorId/orders/new-orders">
                                            <TabbedOrders tabName="new-orders" />
                                        </Route>
                                        <Route exact path="/vendor/:vendorId/orders/ongoing-orders">
                                            <TabbedOrders tabName="ongoing-orders" />
                                        </Route>
                                        <Route exact path="/vendor/:vendorId/orders/ongoing-orders/:orderId">
                                            <TabbedOrders tabName="ongoing-orders" />
                                        </Route>
                                        <Route exact path="/vendor/:vendorId/orders/shipping-orders">
                                            <TabbedOrders tabName="shipping-orders" />
                                        </Route>
                                        <Route exact path="/vendor/:vendorId/orders/completed-orders">
                                            <TabbedOrders tabName="completed-orders" />
                                        </Route>

                                        <Route path="/terms-and-conditions" exact>
                                            <TermsAndConditions />
                                        </Route>
                                    </Suspense>
                                    <Route path="**">
                                        <Redirect to="/" />
                                    </Route>
                                </Switch>
                            </BodyContainer>
                        </>
                    )}
                    {user && user.userType === 'user' && (
                        <>
                            <Navbar style={{ height: '80px' }} />
                            <Switch>
                                <Route exact path="/">
                                    <Home
                                        useSuitableVendors={[suitableVendors, setSuitableVendors]}
                                        user={user}
                                        loading={isLoading}
                                    />
                                </Route>
                                <Suspense fallback={<LoadingComponent />}>
                                    <Route path="/profile" exact>
                                        <UserProfile />
                                    </Route>
                                    <Route exact path="/suitable-vendors">
                                        <SuitableVendor useSuitableVendors={[suitableVendors, setSuitableVendors]} />
                                    </Route>
                                    <Route exact path="/cart">
                                        <Cart useSuitableVendors={[suitableVendors, setSuitableVendors]} />
                                    </Route>
                                    <Route path="/orders/:userId" exact>
                                        <Orders user={user} />
                                    </Route>
                                    <Route path="/orders/:userId/order/:orderId" exact>
                                        <OneOrder />
                                    </Route>
                                    <Route path="/viewVendor/:vendor" exact>
                                        <ViewVendor />
                                    </Route>
                                    <Route path="/terms-and-conditions" exact>
                                        <TermsAndConditions />
                                    </Route>
                                </Suspense>
                                <Route path="**">
                                    <Redirect to="/" />
                                </Route>
                            </Switch>
                            <Footer />
                        </>
                    )}
                    {user && user.userType === 'admin' && (
                        <>
                            <Navbar style={{ height: '80px' }} />
                            <h1>hello</h1>
                            <Switch>
                                <Route exact path="/">
                                    <Home
                                        useSuitableVendors={[suitableVendors, setSuitableVendors]}
                                        user={user}
                                        loading={isLoading}
                                    />
                                </Route>
                                <Route exact path="/admin-dashboard" component={AdminDashboard} />
                            </Switch>
                        </>
                    )}
                </>
            )}
        </AppContainer>
        </div>
    );
}
