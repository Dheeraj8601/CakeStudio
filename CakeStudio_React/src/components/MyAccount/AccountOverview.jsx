import {
    Grid
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import UserInformationCard
    from "./UserInformationCard";

import RecentOrdersCard
    from "./RecentOrdersCard";

import AccountSupportCard
    from "./AccountSupportCard";

import Service
    from "../../services/Service";

import {
    useAuth
} from "../../context/AuthContext";


export default function AccountOverview() {

    const {
        user: authUser,
        loading: authLoading
    } = useAuth();


    const [
        recentOrders,
        setRecentOrders
    ] = useState([]);


    const [
        user,
        setUser
    ] = useState({

        fullName: "",

        email: "",

        mobile: "",

        emailVerified: true,

        mobileVerified: true

    });


    // =========================================================
    // LOAD ACCOUNT DATA
    // =========================================================

    useEffect(() => {

        // Wait until /Auth/me finishes.
        if (authLoading) {
            return;
        }


        // No authenticated user.
        if (!authUser?.userId) {
            return;
        }


        loadUserDetails(
            authUser.userId
        );

        loadRecentOrders();

    }, [
        authLoading,
        authUser?.userId
    ]);


    // =========================================================
    // LOAD USER DETAILS
    // =========================================================

    const loadUserDetails =
        async (userId) => {

            try {

                const res =
                    await Service.getUserById(
                        userId
                    );


                const userData =
                    res.data;


                setUser({

                    ...userData,

                    fullName:
                        `${userData.firstName ?? ""} ${userData.lastName ?? ""}`
                            .trim(),

                    emailVerified:
                        true,

                    mobileVerified:
                        true,

                    mobile:
                        userData.phoneNumber ?? ""

                });

            }
            catch (error) {

                console.error(
                    "Unable to load user details:",
                    error
                );

            }

        };


    // =========================================================
    // LOAD RECENT ORDERS
    // =========================================================

    const loadRecentOrders =
        async () => {

            try {

                const res =
                    await Service.getRecentOrders();


                setRecentOrders(
                    res.data
                );

            }
            catch (error) {

                console.error(
                    "Unable to load recent orders:",
                    error
                );

            }

        };


    // =========================================================
    // UI
    // =========================================================

    return (

        <Grid
            container
            spacing={3}
        >

            <Grid
                size={{
                    xs: 12
                }}
            >

                <UserInformationCard
                    user={user}
                />

            </Grid>


            <Grid
                size={{
                    xs: 12
                }}
            >

                <RecentOrdersCard
                    orders={recentOrders}
                />

            </Grid>


            <Grid
                size={{
                    xs: 12
                }}
            >

                <AccountSupportCard />

            </Grid>

        </Grid>

    );

}