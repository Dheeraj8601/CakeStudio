import { Grid } from "@mui/material";

import UserInformationCard from "./UserInformationCard";
import RecentOrdersCard from "./RecentOrdersCard";
import AccountSupportCard from "./AccountSupportCard";
import SessionManage from "../../Session/SessionManage";
import { useEffect, useState } from "react";
import Service from "../../services/Service";

export default function AccountOverview() {
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

    const recentOrders = [

        {
            id: "ORD-1001",
            image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSX3U6ZS-w7oeuOSgCbBGC3eAoyqjIKTjFrBn8zx7MdHXTJyuh75vVg5fkjq60dc5XEolbs6aAD66Bj772_g0q5wIt4GtmQkZt6PMuBJm1Wu79F4pexnBAV1BlM&usqp=CAc",
            cakeName: "Chocolate Truffle",
            date: "29 Jun 2026",
            amount: 1798,
            status: "Delivered"
        },
        {
            id: "ORD-1002",
            image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSX3U6ZS-w7oeuOSgCbBGC3eAoyqjIKTjFrBn8zx7MdHXTJyuh75vVg5fkjq60dc5XEolbs6aAD66Bj772_g0q5wIt4GtmQkZt6PMuBJm1Wu79F4pexnBAV1BlM&usqp=CAc",
            cakeName: "Red Velvet",
            date: "01 Jul 2026",
            amount: 899,
            status: "Processing"
        }

    ];

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