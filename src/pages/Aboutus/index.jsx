import { team } from "data/db";
import { withTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import TeamMember from "@/components/TeamMember";

import AboutPhoto from "../../assets/Image/About.svg";
import {
    AboutContainer,
    AboutImg,
    AboutSection,
    HeadingContent,
    HeroSection,
    ImgContent,
    ParagrhContent,
    TeamHeading,
    TeamMemberContainer,
    TeamSection,
    TextContent,
} from "../../styles/aboutus.styled";
function Aboutus({ t }) {
    return (
        <div>
            <Navbar />
            <AboutSection>
                <AboutContainer>
                    <HeroSection>
                        <TextContent>
                            <HeadingContent>
                                {t("aboutheroheader")}
                            </HeadingContent>
                            <ParagrhContent>
                                {t("aboutheroparagraph")}
                            </ParagrhContent>
                        </TextContent>
                        <ImgContent>
                            <AboutImg
                                src={AboutPhoto}
                                alt='AboutPhoto'
                                width={896}
                                height={651}
                                priority='true'
                            />
                        </ImgContent>
                    </HeroSection>
                    <TeamSection>
                        <TeamHeading>{t("teamheading")}</TeamHeading>
                        <TeamMemberContainer>
                            {team?.map((member) => {
                                return (
                                    <TeamMember
                                        key={member.id}
                                        surename={member.surename}
                                        desc={member.desc}
                                        Imgmember={member.memberImg}
                                    />
                                );
                            })}
                        </TeamMemberContainer>
                    </TeamSection>
                </AboutContainer>
            </AboutSection>
            <Footer />
        </div>
    );
}

export default withTranslation("common")(Aboutus);

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
            // Will be passed to the page component as props
        },
    };
}
