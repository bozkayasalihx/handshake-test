import {
    ChevronDownIcon,
    ChevronRightIcon,
    CloseIcon,
    HamburgerIcon,
} from "@chakra-ui/icons";
import {
    Box,
    Collapse,
    Flex,
    Heading,
    Icon,
    IconButton,
    Link,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { currentUser, useAppSelector, useLogoutMutation } from "store";
import { Button as GButton, GSpinner } from "ui";
import Natica from "ui/src/assets/Natica";

export default function WithSubnavigation() {
    const { isOpen, onToggle } = useDisclosure();
    const [logout] = useLogoutMutation();
    const user = useAppSelector(currentUser);
    const router = useRouter();

    return (
        <>
            <Flex
                bg={useColorModeValue("white", "gray.800")}
                color={useColorModeValue("gray.600", "white")}
                minH={"60px"}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={"solid"}
                borderColor={useColorModeValue("gray.200", "gray.900")}
                align={"center"}
            >
                <Flex
                    flex={{ base: 1, md: "auto" }}
                    ml={{ base: -2 }}
                    display={{ base: "flex", md: "none" }}
                >
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? (
                                <CloseIcon w={3} h={3} />
                            ) : (
                                <HamburgerIcon w={5} h={5} />
                            )
                        }
                        variant={"ghost"}
                        aria-label={"Toggle Navigation"}
                    />
                </Flex>
                <Flex
                    flex={{ base: 1 }}
                    justify={{
                        base: "center",
                        md: "start",
                    }}
                >
                    <NextLink href="/">
                        <Link _hover={{ textDecor: "none" }}>
                            <Heading
                                textAlign={
                                    useBreakpointValue({
                                        base: "center",
                                        md: "left",
                                    }) as any
                                }
                                fontFamily={"body"}
                                as="h2"
                                color={useColorModeValue("gray.800", "white")}
                            >
                                <Natica />
                                <GSpinner />
                            </Heading>
                        </Link>
                    </NextLink>

                    <Flex
                        display={{
                            base: "none",
                            md: "flex",
                        }}
                        ml={10}
                        flex={10}
                    >
                        <DesktopNav />
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={"flex-end"}
                    direction={"row"}
                    spacing={6}
                >
                    {user.username ? (
                        <>
                            <Link
                                color="gray"
                                p={2}
                                fontSize={"sm"}
                                fontWeight={500}
                                _hover={{
                                    textDecoration: "none",
                                    color: "gray.500",
                                }}
                            >
                                {user.username}
                            </Link>
                            <GButton title="Log out" callback={logout} />
                        </>
                    ) : (
                        <GButton
                            title="Sign In"
                            callback={() => {
                                router.push("/login");
                            }}
                        />
                    )}
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </>
    );
}

const DesktopNav = () => {
    const linkColor = useColorModeValue("gray.600", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");

    return (
        <Stack direction={"row"} spacing={4} alignItems="center" flex={10}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                        {/* @ts-ignore */}
                        <PopoverTrigger key={navItem.label}>
                            {navItem.href ? (
                                <NextLink href={navItem.href}>
                                    <Link
                                        color={"gray"}
                                        title={navItem.label}
                                        p={2}
                                        fontSize={"sm"}
                                        fontWeight={500}
                                        _hover={{
                                            textDecoration: "none",
                                            color: linkHoverColor,
                                        }}
                                    >
                                        {navItem.label}
                                    </Link>
                                </NextLink>
                            ) : (
                                <Link
                                    color={linkColor}
                                    title={navItem.label}
                                    p={2}
                                    fontSize={"sm"}
                                    fontWeight={500}
                                    _hover={{
                                        textDecoration: "none",
                                        color: linkHoverColor,
                                    }}
                                >
                                    {navItem.label}
                                </Link>
                            )}
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={"xl"}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={"xl"}
                                minW={"sm"}
                            >
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav
                                            key={child.label}
                                            {...child}
                                        />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <NextLink href={href as string}>
            <Link
                role={"group"}
                display={"block"}
                p={2}
                rounded={"md"}
                _hover={{ bg: useColorModeValue("green.50", "gray.900") }}
            >
                <Stack direction={"row"} align={"center"}>
                    <Box>
                        <Text
                            transition={"all .3s ease"}
                            _groupHover={{ color: "green.400" }}
                            fontWeight={500}
                        >
                            {label}
                        </Text>
                        <Text fontSize={"sm"}>{subLabel}</Text>
                    </Box>
                    <Flex
                        transition={"all .3s ease"}
                        transform={"translateX(-10px)"}
                        opacity={0}
                        _groupHover={{
                            opacity: "100%",
                            transform: "translateX(0)",
                        }}
                        justify={"flex-end"}
                        align={"center"}
                        flex={1}
                    >
                        <Icon
                            color={"green.400"}
                            w={5}
                            h={5}
                            as={ChevronRightIcon}
                        />
                    </Flex>
                </Stack>
            </Link>
        </NextLink>
    );
};

const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue("white", "gray.800")}
            p={4}
            display={{ md: "none" }}
        >
            {NAV_ITEMS.map((navItem, index) => (
                <MobileNavItem key={index} {...navItem} />
            ))}
        </Stack>
    );
};

interface InnerComponentProps {
    href?: string;
    isOpen: boolean;
    label: string;
    isHaveChildren?: boolean;
}

const InnerComponent = ({
    isHaveChildren,
    isOpen,
    label,
}: InnerComponentProps) => (
    <Flex
        py={2}
        as={Link}
        justify={"space-between"}
        align={"center"}
        _hover={{
            textDecoration: "none",
        }}
    >
        <Text
            fontWeight={600}
            color={useColorModeValue("gray.600", "gray.200")}
        >
            {label}
        </Text>
        {isHaveChildren && (
            <Icon
                as={ChevronDownIcon}
                transition={"all .25s ease-in-out"}
                transform={isOpen ? "rotate(180deg)" : ""}
                w={6}
                h={6}
            />
        )}
    </Flex>
);

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Stack spacing={4} onClick={children && onToggle}>
            {href ? (
                <NextLink href={href}>
                    <Flex
                        py={2}
                        as={Link}
                        justify={"space-between"}
                        align={"center"}
                        textDecoration="none"
                    >
                        <Link
                            fontWeight={600}
                            color={"gray.600"}
                            textDecoration="none"
                        >
                            {label}
                        </Link>
                    </Flex>
                </NextLink>
            ) : (
                <InnerComponent
                    isOpen={isOpen}
                    label={label}
                    isHaveChildren={children ? true : false}
                />
            )}

            <Collapse
                in={isOpen}
                animateOpacity
                style={{ marginTop: "0!important" }}
            >
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={"solid"}
                    borderColor={useColorModeValue("gray.200", "gray.700")}
                    align={"start"}
                >
                    {children &&
                        children.map((child) =>
                            child.href ? (
                                <NextLink href={child.href} key={child.label}>
                                    <Link py={2}>{child.label}</Link>
                                </NextLink>
                            ) : (
                                <Link key={child.label} py={2}>
                                    {child.label}
                                </Link>
                            )
                        )}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: "Works",
        children: [
            {
                label: "Select A Vendor",
                subLabel: "select a vendor the work with",
                href: "/vendor",
            },
            {
                label: "Select A Dealer",
                subLabel: "select as dealer to work with",
                href: "/dealer",
            },
        ],
    },
    {
        label: "Relations",
        children: [
            {
                label: "User Relation",
                subLabel: "select as user relation",
                href: "/entity-relation",
            },
            {
                label: "Other",
                subLabel: "make me alive",
                href: "/other",
            },
        ],
    },
    {
        label: "File Upload",
        href: "/fileupload/invoice",
    },
];
