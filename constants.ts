import { Committee, TeamMember, GalleryItem } from "./types";

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "Team", path: "/team" },
  { label: "Blogs", path: "/blogs" },
  { label: "Gallery", path: "/gallery" },
];

export const OFFICERS: TeamMember[] = [
  { id: "o1", name: "Manish Adhikari", role: "Chair" },
  { id: "o2", name: "Suparna Neupane", role: "Vice Chair" },
  { id: "o3", name: "Anuska Bashyal", role: "Secretary" },
  { id: "o4", name: "Aashutosh Yadav", role: "Treasurer" },
  { id: "o5", name: "Animesh Dhakal", role: "Webmaster" },
  { id: "o6", name: "Grishma Sitaula", role: "Vice Secretary" },
];

export const SENIOR_EXECS: TeamMember[] = [
  { id: "se1", name: "Prashansa Shrestha", role: "Senior Executive Member" },
  { id: "se2", name: "Aeva Acharya", role: "Senior Executive Member" },
];

export const COMMITTEES: Committee[] = [
  {
    title: "Activity Committee",
    members: [
      { id: "ac1", name: "Utsav Dhakal", role: "Activity Coordinator" },
      { id: "ac2", name: "Adhish Poudel", role: "Executive Member" },
      { id: "ac3", name: "Anshu Sharma", role: "Executive Member" },
      { id: "ac4", name: "Aaditya Raj Uprety", role: "Executive Member" },
      { id: "ac5", name: "Aarogya Nepal", role: "Executive Member" },
    ],
  },
  {
    title: "External Relations Committee",
    members: [
      { id: "er1", name: "Nabina Thapa", role: "ER Coordinator" },
      { id: "er2", name: "Prastav Pandey", role: "Executive Member" },
      { id: "er3", name: "Prayusha Pokhrel", role: "Executive Member" },
      { id: "er4", name: "Shreya Khanal", role: "Executive Member" },
      { id: "er5", name: "Bibek Poudel", role: "Executive Member" },
    ],
  },
  {
    title: "Media Committee",
    members: [
      { id: "mc1", name: "Prakriti Poudel", role: "Media Coordinator" },
      { id: "mc2", name: "Bishrant Ghimire", role: "Creative Director" },
      { id: "mc3", name: "Ritika KC", role: "Executive Member" },
      { id: "mc4", name: "Anjila Bashyal", role: "Executive Member" },
    ],
  },
  {
    title: "Graphics Committee",
    members: [
      { id: "gc1", name: "Aashraya Neupane", role: "Graphics Coordinator" },
      { id: "gc2", name: "Amisha Adhikari", role: "Executive Member" },
      { id: "gc3", name: "Samrachana Sharma", role: "Executive Member" },
      { id: "gc4", name: "Binisha Parajuli", role: "Executive Member" },
    ],
  },
  {
    title: "R&D Committee",
    members: [
      { id: "rd1", name: "Sostika Shrestha", role: "R&D Coordinator" },
      { id: "rd2", name: "Sheshadri Bandyopadhyay", role: "Executive Member" },
      { id: "rd3", name: "Sarthak Bhattarai", role: "Executive Member" },
      { id: "rd4", name: "Gagan Bhusal", role: "Executive Member" },
    ],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Robotics Workshop",
    date: "2024",
    category: "Workshops",
    imageUrl:
      "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g2",
    title: "Annual General Meeting",
    date: "2023",
    category: "Events",
    imageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g3",
    title: "Guest Lecture Series",
    date: "2024",
    category: "Seminars",
    imageUrl:
      "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g4",
    title: "Hackathon Winners",
    date: "2023",
    category: "Competitions",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c54be3855833?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g5",
    title: "Project Demonstration",
    date: "2024",
    category: "Workshops",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g6",
    title: "Community Cleanup",
    date: "2023",
    category: "Social",
    imageUrl:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g7",
    title: "Hardware Training",
    date: "2024",
    category: "Workshops",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "g8",
    title: "Networking Dinner",
    date: "2023",
    category: "Social",
    imageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800",
  },
];
