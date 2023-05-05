import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { withTranslation } from "next-i18next";
import { useEffect, useState } from "react";

import { auth } from "@/utils/firebase";

import { HeroButton } from "./hero.style";

const DonateButton = ({ t }) => {
    const route = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const Listerner = onAuthStateChanged(auth, async (user) => {
            setIsAuthenticated(Boolean(user));
        });
        return () => {
            Listerner();
        };
    }, []);

    function handleclick() {
        if (isAuthenticated) {
            route.push("/AddItems");
        } else {
            route.push("/Signin");
        }
    }
    return <HeroButton onClick={handleclick}>{t("DonateNow")}</HeroButton>;
};

export default withTranslation("hero")(DonateButton);
