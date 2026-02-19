import { Committee, TeamMember, GalleryItem } from "./types";

export const NAV_LINKS = [
    { label: "Home", path: "/" },
    { label: "Events", path: "/events" },
    { label: "Team", path: "/team" },
    { label: "Blogs", path: "/blogs" },
    { label: "Gallery", path: "/gallery" },
];

export interface TeamData {
    officers: TeamMember[];
    seniorExecs: TeamMember[];
    committees: Committee[];
}

export const TEAM_DATA: Record<string, TeamData> = {
    "2026": {
        officers: [
            {
                id: "o1",
                name: "Manish Adhikari",
                role: "Chair",
                imageUrl: "/committee/2026/manish-adhikari.png",
                linkedin:
                    "https://www.linkedin.com/in/manish-adhikari-525358214/",
            },
            {
                id: "o2",
                name: "Suparna Neupane",
                role: "Vice Chair",
                imageUrl: "/committee/2026/suparna-neupane.png",
                linkedin: "https://www.linkedin.com/in/suparna-neupane",
            },
            {
                id: "o3",
                name: "Anuska Bashyal",
                role: "Secretary",
                imageUrl: "/committee/2026/anuska-bashyal.png",
                linkedin:
                    "https://www.linkedin.com/in/anuska-bashyal-618745247",
            },
            {
                id: "o4",
                name: "Aashutosh Yadav",
                role: "Treasurer",
                linkedin:
                    "https://www.linkedin.com/in/aashutosh-yadav-9167832b4",
            },
            { id: "o5", name: "Grishma Sitaula", role: "Vice Secretary" },
            {
                id: "o6",
                name: "Animesh Dhakal",
                role: "Webmaster",
                imageUrl: "/committee/2026/animesh-dhakal.png",
                linkedin: "https://www.linkedin.com/in/animeshdhakal/",
            },
        ],
        seniorExecs: [
            {
                id: "se1",
                name: "Prashansa Shrestha",
                role: "Senior Executive Member",
                imageUrl: "/committee/2026/prashansa-shrestha.png",
                linkedin: "https://www.linkedin.com/in/prashansa-shrestha/",
            },
            {
                id: "se2",
                name: "Aeva Acharya",
                role: "Senior Executive Member",
                imageUrl: "/committee/2026/aeva-acharya.png",
                linkedin: "https://np.linkedin.com/in/aevaacharya",
            },
        ],
        committees: [
            {
                title: "Activity Committee",
                members: [
                    {
                        id: "ac1",
                        name: "Utsav Dhakal",
                        role: "Activity Coordinator",
                        imageUrl: "/committee/2026/utsav-dhakal.png",
                        linkedin:
                            "https://www.linkedin.com/in/utsav-dhakal-861357366/",
                    },
                    {
                        id: "ac2",
                        name: "Adhish Poudel",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/adhish-poudel.png",
                        linkedin:
                            "https://www.linkedin.com/in/adhish-paudel-36200a34b/",
                    },
                    {
                        id: "ac3",
                        name: "Anshu Sharma",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/anshu-sharma.png",
                        linkedin:
                            "https://www.linkedin.com/in/anshu-sharma-301b36349/",
                    },
                    {
                        id: "ac4",
                        name: "Aaditya Raj Uprety",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/aditya-raj-upreti.png",
                        linkedin:
                            "https://www.linkedin.com/in/aaditya-raj-uprety-113b10293",
                    },
                    {
                        id: "ac5",
                        name: "Aarogya Nepal",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/aarogya-nepal.png",
                        linkedin:
                            "https://www.linkedin.com/in/aarogya-nepal-b38513326",
                    },
                ],
            },
            {
                title: "External Relations Committee",
                members: [
                    { id: "er1", name: "Nabina Thapa", role: "ER Coordinator" },
                    {
                        id: "er2",
                        name: "Prastav Pandey",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/prastav-pandey.png",
                        linkedin:
                            "https://www.linkedin.com/in/prastav-pandey-185328309/",
                    },
                    {
                        id: "er3",
                        name: "Prayusha Pokhrel",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/prayusha-pokhrel.png",
                        linkedin:
                            "https://www.linkedin.com/in/prayusha-pokhrel-b03052373/",
                    },
                    {
                        id: "er4",
                        name: "Shreya Khanal",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/shreya-khanal.png",
                        linkedin:
                            "https://www.linkedin.com/in/shreya-k-2b9037334",
                    },
                    {
                        id: "er5",
                        name: "Bibek Poudel",
                        role: "Executive Member",
                    },
                ],
            },
            {
                title: "Media Committee",
                members: [
                    {
                        id: "mc1",
                        name: "Prakriti Poudel",
                        role: "Media Coordinator",
                        imageUrl: "/committee/2026/prakriti-poudel.png",
                    },
                    {
                        id: "mc2",
                        name: "Bishrant Ghimire",
                        role: "Creative Director",
                        imageUrl: "/committee/2026/bishrant-ghimire.png",
                    },
                    { id: "mc3", name: "Ritika KC", role: "Executive Member" },
                    {
                        id: "mc4",
                        name: "Anjila Bashyal",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/anjila-bashyal.png",
                    },
                    {
                        id: "mc5",
                        name: "Princy Mishra",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/princy-mishra.png",
                    },
                ],
            },
            {
                title: "Graphics Committee",
                members: [
                    {
                        id: "gc1",
                        name: "Aashraya Neupane",
                        role: "Graphics Coordinator",
                        imageUrl: "/committee/2026/aashraya-neupane.png",
                        linkedin:
                            "https://www.linkedin.com/in/aashraya-neupane-3960b032a/",
                    },
                    {
                        id: "gc2",
                        name: "Amisha Adhikari",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/amisha-adhikari.png",
                        linkedin:
                            "https://www.linkedin.com/in/amisha-adhikari-138548368",
                    },
                    {
                        id: "gc3",
                        name: "Samrachana Sharma",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/samrachana-sharma.png",
                        linkedin:
                            "https://www.linkedin.com/in/samrachana-sharma-4030933a0/",
                    },
                    {
                        id: "gc4",
                        name: "Binisha Parajuli",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/binisha-parajuli.png",
                        linkedin:
                            "https://www.linkedin.com/in/binisha-parajuli-354931371/",
                    },
                ],
            },
            {
                title: "R&D Committee",
                members: [
                    {
                        id: "rd1",
                        name: "Sostika Shrestha",
                        role: "R&D Coordinator",
                        imageUrl: "/committee/2026/sostika-shrestha.png",
                    },
                    {
                        id: "rd2",
                        name: "Sheshadri Bandyopadhyay",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/sheshadri-sb.png",
                        linkedin: "https://www.linkedin.com/in/sheshadrisb/",
                    },
                    {
                        id: "rd3",
                        name: "Sarthak Bhattarai",
                        role: "Executive Member",
                    },
                    {
                        id: "rd4",
                        name: "Gagan Bhusal",
                        role: "Executive Member",
                        imageUrl: "/committee/2026/gagan-bhusal.png",
                        linkedin: "https://www.linkedin.com/in/gaganbhusal/",
                    },
                ],
            },
        ],
    },
    "2025": {
        officers: [
            { id: "25o1", name: "Apala Timalsina", role: "Chair" },
            { id: "25o2", name: "Supreme Bhandari", role: "Vice Chair" },
            { id: "25o3", name: "Aeva Acharya", role: "Secretary" },
            { id: "25o4", name: "Siwansh Pathak", role: "Vice Secretary" },
            { id: "25o5", name: "Vilakshan Gyawali", role: "Treasurer" },
            { id: "25o6", name: "Rabin Lamichhane", role: "Webmaster" },
        ],
        seniorExecs: [],
        committees: [
            {
                title: "Activity Committee",
                members: [
                    {
                        id: "25ac1",
                        name: "Manish Adhikari",
                        role: "Activity Coordinator",
                    },
                    {
                        id: "25ac2",
                        name: "Suparna Neupane",
                        role: "Executive Member",
                    },
                    {
                        id: "25ac3",
                        name: "Pariskar Sharma Poudel",
                        role: "Executive Member",
                    },
                    {
                        id: "25ac4",
                        name: "Swaroop Sigdel",
                        role: "Executive Member",
                    },
                    {
                        id: "25ac5",
                        name: "Anuja Gyawali",
                        role: "Executive Member",
                    },
                    {
                        id: "25ac6",
                        name: "Anuska Bashyal",
                        role: "Executive Member",
                    },
                ],
            },
            {
                title: "External Relations Committee",
                members: [
                    {
                        id: "25er1",
                        name: "Prashansa Shrestha",
                        role: "ER Coordinator",
                    },
                    {
                        id: "25er2",
                        name: "Ashutosh Bhattarai",
                        role: "Sponsorship Coordinator",
                    },
                    {
                        id: "25er3",
                        name: "Bigyan Adhikari",
                        role: "Executive Member",
                    },
                    {
                        id: "25er4",
                        name: "Aashutosh Kumar Yadav",
                        role: "Executive Member",
                    },
                    {
                        id: "25er5",
                        name: "Sandesh Poudel",
                        role: "Executive Member",
                    },
                    {
                        id: "25er6",
                        name: "Bibek Neupane",
                        role: "Executive Member",
                    },
                ],
            },
            {
                title: "Graphics Committee",
                members: [
                    {
                        id: "25gc1",
                        name: "Sashmin Adhikari",
                        role: "Graphics Coordinator",
                    },
                    {
                        id: "25gc2",
                        name: "Grishma Sitaula",
                        role: "Executive Member",
                    },
                    {
                        id: "25gc3",
                        name: "Nabina Thapa",
                        role: "Executive Member",
                    },
                    {
                        id: "25gc4",
                        name: "Rakesh Kumar Yadav",
                        role: "Executive Member",
                    },
                    {
                        id: "25gc5",
                        name: "Aayusha Budhathoki",
                        role: "Executive Member",
                    },
                ],
            },
            {
                title: "Media Committee",
                members: [
                    {
                        id: "25mc1",
                        name: "Riya Jha",
                        role: "Media Coordinator",
                    },
                    {
                        id: "25mc2",
                        name: "Ishant Yadav",
                        role: "Executive Member",
                    },
                    {
                        id: "25mc3",
                        name: "Prajit Thapa",
                        role: "Executive Member",
                    },
                    {
                        id: "25mc4",
                        name: "Sunil Lamichhane",
                        role: "Executive Member",
                    },
                    {
                        id: "25mc5",
                        name: "Sostika Shrestha",
                        role: "Executive Member",
                    },
                    {
                        id: "25mc6",
                        name: "Hritesh Rai",
                        role: "Creative Director",
                    },
                ],
            },
            {
                title: "R&D Committee",
                members: [
                    {
                        id: "25rd1",
                        name: "Manjila Pandey",
                        role: "R&D Coordinator",
                    },
                    {
                        id: "25rd2",
                        name: "Anurag Sah",
                        role: "Executive Member",
                    },
                    {
                        id: "25rd3",
                        name: "Pra olio Chtap Kunwar",
                        role: "Executive Member",
                    },
                    {
                        id: "25rd4",
                        name: "Niraj Karki",
                        role: "Executive Member",
                    },
                ],
            },
        ],
    },
};

export const GALLERY_ITEMS: GalleryItem[] = [
    {
        id: "g1",
        title: "IEEE 2026 First Meetup",
        date: "2026",
        category: "Meetup",
        imageUrl: "/gallery/ieee-2026-first-meetup.jpeg",
    },
    {
        id: "g2",
        title: "Stemfluence 2.0",
        date: "2026",
        category: "Event",
        imageUrl: "/gallery/stemfluence-2.0-1.jpeg",
    },
];
