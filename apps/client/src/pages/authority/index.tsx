import { Box, Heading, Select, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { currentUser, useAppSelector } from "store";
import { useGetAuthorityMutation } from "store/src/services/authorityApi";
import { Button } from "ui";

interface IAuthority {}
/**
 *
 *
 *                       vendor
 *                         |
 *
 *                   daler    buyer
 *                   |          |
 *
 *               dealer site   buyer site
 *
 *
 *
 *
 *
 */
const Authority: NextPage<IAuthority> = ({}) => {
    const [listAuthority, { isLoading, data, isError }] =
        useGetAuthorityMutation({ fixedCacheKey: "vdsbs" });
    const user = useAppSelector(currentUser);

    const [parent, setParent] = useState(Object.keys(data?.data || []));
    const [child, setChild] = useState<string[]>([]);
    const [gchild, setGchild] = useState<string[]>([]);

    const [option, setOption] = useState<{
        parent: string;
        child: string;
        gchild: string;
    }>({ parent: "", child: "", gchild: "" });

    useEffect(() => {
        listAuthority({ userId: user.user_id });
    }, [isError, listAuthority, user.user_id]);

    const userType = useMemo(() => {
        const userType =
            user.user_type === "BA" || user.user_type === "B"
                ? "buyer"
                : "dealer";
        return userType;
    }, [user.user_type]);

    const handleParent = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
        const curVal = ev.currentTarget.value;
        setOption((prev) => ({ ...prev, parent: curVal }));
    }, []);

    const handleChild = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
        const curVal = ev.currentTarget.value;
        setOption((prev) => ({ ...prev, child: curVal }));
    }, []);

    const handleGChild = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
        ev.preventDefault();
        const curVal = ev.currentTarget.value;
        setOption((prev) => ({ ...prev, gchild: curVal }));

        console.log("james dean");
    }, []);

    useEffect(() => {
        if (option.parent) {
            setChild(Object.keys(data?.data[option.parent][userType] || []));
            if (option.child) {
                const obj = data?.data[option.parent][userType][option.child];
                const keys = Object.keys(obj || []);
                let temp: string[] = [];
                for (let i = 0; i < keys.length; i++) {
                    if (typeof obj[keys[i]] === "object") {
                        temp.push(keys[i]);
                    }
                }
                setGchild(temp);
            }
        }
    }, [data?.data, option.child, option.parent, userType]);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isError || !data) {
        return <Text>an error accured try again later</Text>;
    }

    return (
        <Box w={"80%"} margin={"0 auto"} mt={5}>
            <Heading textAlign={"center"} size="lg" mb={3}>
                Yetki Secimi{" "}
            </Heading>
            <Box>
                <Select placeholder="Vendor" onChange={handleParent} mb={3}>
                    {parent.map((item) => (
                        <option key={item}>{item}</option>
                    ))}
                </Select>
                <Select
                    placeholder={
                        userType[0].toUpperCase() + userType.substring(1)
                    }
                    onChange={handleChild}
                    disabled={child.length > 0 ? false : true}
                    mb={3}
                >
                    {child.map((item) => (
                        <option key={item}>{item}</option>
                    ))}
                </Select>
                <Select
                    placeholder={`${
                        userType[0].toUpperCase() + userType.substring(1)
                    } Site`}
                    onChange={handleGChild}
                    disabled={gchild.length > 0 ? false : true}
                >
                    {gchild.map((item) => (
                        <option key={item}>{item}</option>
                    ))}
                </Select>
            </Box>
            <Button
                title="Onayla"
                bg="#97D70E"
                callback={() => console.log("i' mdone")}
            />
        </Box>
    );
};

export default Authority;
