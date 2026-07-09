import { Grid } from "@mui/material";

import UserInformationCard from "./UserInformationCard";
import RecentOrdersCard from "./RecentOrdersCard";
import AccountSupportCard from "./AccountSupportCard";
import SessionManage from "../../Session/SessionManage";
import { useEffect, useState } from "react";
import Service from "../../services/Service";

export default function AccountOverview() {
    const [recentOrders, setRecentOrders] = useState([]);
    const UserId = SessionManage.getUserId();
    const [user, setUser] = useState({

        fullName: "",

        email: "",

        mobile: "",

        emailVerified: true,

        mobileVerified: true

    });

    useEffect(() => {
        loadUserDetails();
        loadRecentOrders();
    }, [])

    const loadUserDetails = async () => {
        try {
            const res = await Service.getUserById(UserId);
            console.log(res, "user Info");
            setUser(() => {
                return {
                    ...res.data,
                    fullName: res.data.firstName + " " + res.data.lastName,
                    emailVerified: true,
                    mobileVerified: true,
                    mobile: "+91 9876543210",
                }
            })
        } catch (err) {

        }
    }


    const loadRecentOrders = async () => {

        try {

            const res = await Service.getRecentOrders();

            setRecentOrders(res.data);

        }
        catch (err) {

            console.error(err);

        }

    };

    return (

        <Grid
            container
            spacing={3}
        >

            <Grid size={{ xs: 12 }}>

                <UserInformationCard
                    user={user}
                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <RecentOrdersCard
                    orders={recentOrders}
                />

            </Grid>

            <Grid size={{ xs: 12 }}>

                <AccountSupportCard />

            </Grid>

        </Grid>

    );

}