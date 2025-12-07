const MOVIES_DATA = [
    // Telugu movies
    {
        id: 1, title: "They Call Him OG", genre: "Action", language: "Telugu", format: "2D", rating: 7.3, duration: 154, age: "A", year: 2024,
        img: "trailers/og1.jpg", description: "Action, Crime, Revenge Drama", badge: "New",
        trailer: "trailers/tollywood/og_trailer.mp4",
        cast: ["Pawan Kalyan", "Emraan Hashmi", "Priyanka Arul Mohan", "Arjun Das", "Sriya Reddy"]
    },
    {
        id: 2, title: "Mirai", genre: "Sci-Fi", language: "Telugu", format: "3D", rating: 7.8, duration: 169, age: "UA", year: 2024,
        img: "trailers/mirai1.jpeg", description: "Action, Sci-Fi, Fantasy", badge: "3D",
        trailer: "trailers/tollywood/mirai_trailer.mp4",
        cast: ["Teja Sajja", "Ritika Nayak", "Sathyaraj", "Rajeev Kanakala", "Harsha Chemudu"]
    },
    {
        id: 3, title: "Ghaati", genre: "Crime", language: "Telugu", format: "2D", rating: 6.6, duration: 155, age: "UA", year: 2024,
        img: "trailers/ghaati1.jpg", description: "Crime Thriller, Action", badge: "",
        trailer: "trailers/tollywood/ghaati_trailer.mp4",
        cast: ["Anushka Shetty", "Indrajith Sukumaran", "Srinivas Avasarala", "Ajay Ghosh", "Harsha Vardhan"]
    },
    {
        id: 4, title: "Subham", genre: "Horror", language: "Telugu", format: "2D", rating: 6.2, duration: 125, age: "UA", year: 2024,
        img: "trailers/subham1.jpg", description: "Horror Comedy", badge: "",
        trailer: "trailers/tollywood/subham_trailer.mp4",
        cast: ["Sree Vishnu", "Priyadarshi", "Faria Abdullah", "Viva Harsha", "Ajay"]
    },
    {
        id: 5, title: "Laila", genre: "Comedy", language: "Telugu", format: "2D", rating: 5.8, duration: 136, age: "UA", year: 2024,
        img: "trailers/laila1.jpg", description: "Action Comedy, Romance", badge: "",
        trailer: "trailers/tollywood/laila_trailer.mp4",
        cast: ["Tamannaah Bhatia", "Sidhu Jonnalagadda", "Vennela Kishore", "Vidyullekha Raman", "Ajay Kumar"]
    },
    {
        id: 6, title: "Badmashulu", genre: "Comedy", language: "Telugu", format: "2D", rating: 6.0, duration: 158, age: "U", year: 2024,
        img: "trailers/badmashulu1.jpg", description: "Rural Comedy, Family Drama", badge: "",
        trailer: "trailers/tollywood/badmashulu_trailer.mp4",
        cast: ["Allari Naresh", "Sunil", "Saptagiri", "Hyper Aadi", "Chandini Chowdary"]
    },
    {
        id: 7, title: "Gopi Galla Goa Trip", genre: "Drama", language: "Telugu", format: "2D", rating: 7.1, duration: 142, age: "UA", year: 2024,
        img: "trailers/gopi galla goa trip1.jpg", description: "Road Movie, Coming-of-Age, Drama", badge: "",
        trailer: "trailers/tollywood/gopi_galla_goa_trip_trailer.mp4",
        cast: ["Suhas", "Harsha Chemudu", "Viva Harsha", "Abhinav Gomatam", "Priya Vadlamani"]
    },
    {
        id: 8, title: "K-Ramp", genre: "Comedy", language: "Telugu", format: "2D", rating: 6.4, duration: 141, age: "UA", year: 2024,
        img: "trailers/kramp1.jpg", description: "Romantic Comedy, Drama", badge: "",
        trailer: "trailers/tollywood/kramp_trailer.mp4",
        cast: ["Kiran Abbavaram", "Priyanka Jawalkar", "Sudarshan", "Brahmaji", "Praveen"]
    },
    {
        id: 9, title: "Telusu Kada", genre: "Romance", language: "Telugu", format: "2D", rating: 7.4, duration: 140, age: "UA", year: 2024,
        img: "trailers/telsukada1.jpg", description: "Romance, Drama", badge: "",
        trailer: "trailers/tollywood/telusu_kada_trailer.mp4",
        cast: ["Siddu Jonnalagadda", "Raashi Khanna", "Ali", "Tanikella Bharani", "Rohini"]
    },
    {
        id: 10, title: "Mass Jathara", genre: "Action", language: "Telugu", format: "IMAX", rating: 7.0, duration: 152, age: "UA", year: 2024,
        img: "trailers/mass jathara1.jpg", description: "Action, Mass Drama", badge: "IMAX",
        trailer: "trailers/tollywood/mass_jathara_trailer.mp4",
        cast: ["Vishwak Sen", "Neha Shetty", "Rao Ramesh", "Ajay", "Hyper Aadi"]
    },
    {
        id: 11, title: "Premante", genre: "Romance", language: "Telugu", format: "2D", rating: 7.2, duration: 138, age: "U", year: 2024,
        img: "trailers/premante1.jpeg", description: "Romantic Comedy", badge: "",
        trailer: "trailers/tollywood/premante_trailer.mp4",
        cast: ["Anand Deverakonda", "Vaishnavi Chaitanya", "Harsha Chemudu", "Abhinav Gomatam", "Rajeev Kanakala"]
    },
    {
        id: 12, title: "Andhela Ravamidhi", genre: "Musical", language: "Telugu", format: "2D", rating: 7.5, duration: 141, age: "U", year: 2024,
        img: "trailers/andhela1.avif", description: "Musical, Emotional Drama", badge: "",
        trailer: "trailers/tollywood/andhela_ravamidhi_trailer.mp4",
        cast: ["Vijay Deverakonda", "Krithi Shetty", "Sunil", "Brahmaji", "Nassar"]
    },
    {
        id: 13, title: "Shashtipoorthi", genre: "Drama", language: "Telugu", format: "2D", rating: 6.8, duration: 130, age: "U", year: 2024,
        img: "trailers/shashtipoorti1.webp", description: "Family Drama", badge: "",
        trailer: "trailers/tollywood/shashtipoorthi_trailer.mp4",
        cast: ["Rajendra Prasad", "Naresh", "Suhasini", "Brahmanandam", "Prudhvi Raj"]
    },
    {
        id: 14, title: "Uppu Kappurambu", genre: "Comedy", language: "Telugu", format: "2D", rating: 7.6, duration: 136, age: "U", year: 2024,
        img: "trailers/uppu1.jpg", description: "Feel-good Comedy, Drama", badge: "Hit",
        trailer: "trailers/tollywood/uppu_kappurambu_trailer.mp4",
        cast: ["Suhas", "Rukshar Dhillon", "Vennela Kishore", "Viva Harsha", "Satyam Rajesh"]
    },
    {
        id: 15, title: "14", genre: "Mystery", language: "Telugu", format: "2D", rating: 7.0, duration: 148, age: "UA", year: 2024,
        img: "trailers/14-1.jpg", description: "Mystery, Thriller, Drama", badge: "",
        trailer: "trailers/tollywood/14_trailer.mp4",
        cast: ["Nikhil Siddhartha", "Anupama Parameswaran", "Ajay", "Tulasi", "Kalpalatha"]
    },

    // Hollywood movies
    {
        id: 16, title: "Avatar: Fire and Ash", genre: "Sci-Fi", language: "English", format: "3D", rating: 8.2, duration: 160, age: "UA", year: 2025,
        img: "trailers/avatar1.webp", description: "Sci-Fi, Adventure, Fantasy | Cast: Sam Worthington, Zoe Saldaña", badge: "2025", trailer: "",
        cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang", "Kate Winslet"]
    },
    {
        id: 17, title: "How to Train Your Dragon", genre: "Fantasy", language: "English", format: "2D", rating: 7.9, duration: 125, age: "U", year: 2025,
        img: "trailers/how to train your dragon1.webp", description: "Fantasy, Adventure | Cast: Mason Thames, Nico Parker", badge: "Live Action", trailer: "",
        cast: ["Mason Thames", "Nico Parker", "Gerard Butler", "Nick Frost", "Julian Dennison"]
    },
    {
        id: 18, title: "The Running Man", genre: "Action", language: "English", format: "2D", rating: 7.3, duration: 133, age: "A", year: 2025,
        img: "trailers/runningman1.jpg", description: "Action, Thriller, Dystopia | Cast: Glen Powell, William H. Macy", badge: "", trailer: "",
        cast: ["Glen Powell", "Will Poulter", "Ben Barnes", "Giancarlo Esposito", "Saoirse Ronan"]
    },
    {
        id: 19, title: "The SpongeBob Movie: Search for SquarePants", genre: "Animation", language: "English", format: "2D", rating: 7.1, duration: 96, age: "U", year: 2025,
        img: "trailers/spongebob1.webp", description: "Animated, Adventure, Comedy | Cast: Tom Kenny, Clancy Brown", badge: "", trailer: "",
        cast: ["Tom Kenny", "Bill Fagerbakke", "Clancy Brown", "Mr. Lawrence", "Rodger Bumpass"]
    },
    {
        id: 20, title: "The Fantastic Four: First Steps", genre: "Superhero", language: "English", format: "IMAX", rating: 7.0, duration: 135, age: "UA", year: 2025,
        img: "trailers/fantastic4-1.jpeg", description: "Superhero, Action, Family | Cast: Pedro Pascal, Vanessa Kirby", badge: "Marvel", trailer: "",
        cast: ["Pedro Pascal", "Vanessa Kirby", "Joseph Quinn", "Ebon Moss-Bachrach", "Ralph Ineson"]
    },
    {
        id: 21, title: "Wicked: For Good", genre: "Musical", language: "English", format: "2D", rating: 7.4, duration: 135, age: "UA", year: 2025,
        img: "trailers/wicked1.webp", description: "Musical, Fantasy, Drama | Cast: Cynthia Erivo, Ariana Grande", badge: "", trailer: "",
        cast: ["Cynthia Erivo", "Ariana Grande", "Jonathan Bailey", "Jeff Goldblum", "Michelle Yeoh"]
    },
    {
        id: 22, title: "Scream 7", genre: "Horror", language: "English", format: "2D", rating: 6.8, duration: 110, age: "A", year: 2025,
        img: "trailers/scream7-1.jpg", description: "Horror, Slasher | Cast: Neve Campbell, Courteney Cox", badge: "", trailer: "",
        cast: ["Neve Campbell", "Courteney Cox", "Mason Gooding", "Jasmin Savoy Brown", "Hayden Panettiere"]
    },
    {
        id: 23, title: "Anaconda", genre: "Adventure", language: "English", format: "2D", rating: 6.5, duration: 120, age: "A", year: 2025,
        img: "trailers/anaconda1.jpg", description: "Adventure, Horror, Thriller | Cast: Jack Black, Paul Rudd", badge: "", trailer: "",
        cast: ["Paul Rudd", "Jack Black", "Thandiwe Newton", "Winston Duke", "Jenna Ortega"]
    },
    {
        id: 24, title: "Jurassic World: Rebirth", genre: "Sci-Fi", language: "English", format: "IMAX", rating: 7.6, duration: 145, age: "UA", year: 2025,
        img: "trailers/jurassic world1.jpg", description: "Sci-Fi, Adventure, Action | Cast: Scarlett Johansson, Jonathan Bailey", badge: "IMAX", trailer: "",
        cast: ["Chris Pratt", "Bryce Dallas Howard", "Justice Smith", "Isabella Sermon", "Jeff Goldblum"]
    },
    {
        id: 25, title: "Mission: Impossible – The Final Reckoning", genre: "Action", language: "English", format: "IMAX", rating: 7.8, duration: 150, age: "UA", year: 2025,
        img: "trailers/mission impossible1.jpg", description: "Action, Espionage, Thriller | Cast: Tom Cruise, Hayley Atwell", badge: "Finale", trailer: "",
        cast: ["Tom Cruise", "Hayley Atwell", "Simon Pegg", "Rebecca Ferguson", "Ving Rhames"]
    },
    {
        id: 26, title: "F1", genre: "Sport", language: "English", format: "IMAX", rating: 7.2, duration: 130, age: "UA", year: 2025,
        img: "trailers/F1-1.jpg", description: "Sport, Drama, Action | Cast: Brad Pitt, Damson Idris", badge: "", trailer: "",
        cast: ["Brad Pitt", "Damson Idris", "Javier Bardem", "Kerry Condon", "Tobias Menzies"]
    },
    {
        id: 27, title: "The Conjuring: Last Rites", genre: "Horror", language: "English", format: "2D", rating: 6.9, duration: 115, age: "A", year: 2025,
        img: "trailers/conjuring1.jpg", description: "Horror, Supernatural, Thriller | Cast: Vera Farmiga, Patrick Wilson", badge: "", trailer: "",
        cast: ["Patrick Wilson", "Vera Farmiga", "Sterling Jerins", "Ruairi O'Connor", "Ingrid Bisu"]
    },
    {
        id: 28, title: "Die My Love", genre: "Drama", language: "English", format: "2D", rating: 7.0, duration: 130, age: "A", year: 2025,
        img: "trailers/die my love1.jpg", description: "Drama, Psychological, Romance | Cast: Jennifer Lawrence, Robert Pattinson", badge: "", trailer: "",
        cast: ["Jennifer Lawrence", "Robert Pattinson", "Mia Goth", "Jesse Plemons", "LaKeith Stanfield"]
    },
    {
        id: 29, title: "Predator: Badlands", genre: "Sci-Fi", language: "English", format: "2D", rating: 6.7, duration: 125, age: "A", year: 2025,
        img: "trailers/predator1.jpg", description: "Sci-Fi, Action | Cast: Elle Fanning", badge: "", trailer: "",
        cast: ["Boyd Holbrook", "Elle Fanning", "Sterling K. Brown", "Mahershala Ali", "Wyatt Russell"]
    },
    {
        id: 30, title: "Wake Up Dead Man: A Knives Out Mystery", genre: "Mystery", language: "English", format: "2D", rating: 7.3, duration: 140, age: "UA", year: 2025,
        img: "trailers/wake up dead man1.jpg", description: "Mystery, Crime, Comedy | Cast: Daniel Craig, Josh O'Connor", badge: "", trailer: "",
        cast: ["Daniel Craig", "Josh O'Connor", "Cailee Spaeny", "Glenn Close", "Andrew Scott"]
    },

    // New Bollywood movies
    {
        id: 31, title: "Alpha", genre: "Action", language: "Hindi", format: "2D", rating: 7.5, duration: 145, age: "UA", year: 2025,
        img: "trailers/Alpha.jpg", description: "Action, Spy Thriller | Cast: Alia Bhatt, Sharvari | YRF Spy Universe", badge: "YRF",
        trailer: "trailers/SSYouTube.online_Alpha  Official Trailer Alia  Sharvari  Shiv Rawail Aditya Chopra Bobby Deol YRF Spy Universe_720p.mp4",
        cast: ["Alia Bhatt", "Sharvari Wagh", "Bobby Deol", "Aditya Roy Kapur", "Jaideep Ahlawat"]
    },
    {
        id: 32, title: "Dhurandhar", genre: "Action", language: "Hindi", format: "IMAX", rating: 8.0, duration: 155, age: "UA", year: 2025,
        img: "trailers/dhurandar.jpg", description: "Action, War Drama | Cast: Ranveer Singh | Director: Aditya Dhar", badge: "IMAX",
        trailer: "trailers/SSYouTube.online_Dhurandhar Official Trailer  Ranveer Singh  Aditya Dhar  In Cinemas 5th December 2025_720p.mp4",
        cast: ["Ranveer Singh", "Sanjay Dutt", "Arjun Rampal", "R. Madhavan", "Akshaye Khanna"]
    },
    {
        id: 33, title: "HAQ", genre: "Thriller", language: "Hindi", format: "2D", rating: 7.4, duration: 138, age: "UA", year: 2025,
        img: "trailers/haq.jpg", description: "Thriller, Drama | Cast: Yami Gautam Dhar, Emraan Hashmi | Director: Suparn S Varma", badge: "New",
        trailer: "trailers/SSYouTube.online_HAQ  Official Trailer  Yami Gautam Dhar, Emraan Hashmi  Suparn S Varma  In Cinemas 7th Nov_720p.mp4",
        cast: ["Yami Gautam", "Emraan Hashmi", "Jaideep Ahlawat", "Sharad Kelkar", "Kumud Mishra"]
    },
    {
        id: 34, title: "Ikkis", genre: "War", language: "Hindi", format: "2D", rating: 7.8, duration: 150, age: "UA", year: 2025,
        img: "trailers/ikkis.jpg", description: "War, Biographical Drama | Based on true events", badge: "Christmas",
        trailer: "trailers/SSYouTube.online_Ikkis - Official Trailer  In Cinemas Worldwide This Christmas  25th December 2025_720p.mp4",
        cast: ["Agastya Nanda", "Dharmendra", "Jaideep Ahlawat", "Mrunal Thakur", "Raj Zutshi"]
    },
    {
        id: 35, title: "Jatadhara", genre: "Action", language: "Hindi", format: "2D", rating: 7.2, duration: 142, age: "UA", year: 2025,
        img: "trailers/Jatadhara-001.jpg", description: "Action, Thriller | Cast: Sudheer Babu, Sonakshi Sinha | Producer: Prerna Arora", badge: "New",
        trailer: "trailers/SSYouTube.online_JATADHARA Official Hindi Trailer  Sudheer Babu  Sonakshi Sinha  Prerna Arora  In Cinemas 7 Nov_720p.mp4",
        cast: ["Sudheer Babu", "Sonakshi Sinha", "Ravi Kishan", "Prakash Raj", "Raj Arjun"]
    },
    {
        id: 36, title: "Krrish 4: Jaadu Returns", genre: "Superhero", language: "Hindi", format: "IMAX", rating: 8.2, duration: 165, age: "UA", year: 2025,
        img: "trailers/krissh 4.jpg", description: "Superhero, Sci-Fi | Cast: Hrithik Roshan, Bobby Deol, Tiger Shroff, Amitabh Bachchan", badge: "IMAX",
        trailer: "trailers/SSYouTube.online_KRRISH 4 Jaadu Returns - Trailer  Hrithik Roshan  Bobby Deol  Tiger Shroff, Amitabh B  In 2025_720p.mp4",
        cast: ["Hrithik Roshan", "Tiger Shroff", "Bobby Deol", "Amitabh Bachchan", "Nora Fatehi"]
    },
    {
        id: 37, title: "120 Bahadur", genre: "War", language: "Hindi", format: "2D", rating: 7.6, duration: 148, age: "UA", year: 2025,
        img: "trailers/bahadur.jpg", description: "War, Historical | Cast: Farhan Akhtar, Raashii Khanna", badge: "21 Nov",
        trailer: "trailers/SSYouTube.online_120 Bahadur  Official Teaser  Farhan Akhtar  Raashii Khanna  21st November_720p.mp4",
        cast: ["Farhan Akhtar", "Raashii Khanna", "Aditya Seal", "Pankaj Tripathi", "Amruta Subhash"]
    },
    {
        id: 38, title: "De De Pyaar De 2", genre: "Comedy", language: "Hindi", format: "2D", rating: 7.0, duration: 135, age: "UA", year: 2025,
        img: "trailers/de de pyar de.jpg", description: "Romantic Comedy | Cast: Ajay Devgn, R. Madhavan, Rakul Preet, Meezaan Jafri", badge: "14 Nov",
        trailer: "trailers/SSYouTube.online_De De Pyaar De 2 - Official Trailer  Ajay Devgn, R. Madhavan, Rakul Preet, Meezaan Jafri  14th Nov_720p.mp4",
        cast: ["Ajay Devgn", "Rakul Preet Singh", "R. Madhavan", "Meezaan Jafri", "Seema Pahwa"]
    },
    {
        id: 39, title: "Gustaakh Ishq", genre: "Romance", language: "Hindi", format: "2D", rating: 6.9, duration: 132, age: "UA", year: 2025,
        img: "trailers/gustaakh.webp", description: "Romance, Drama | Cast: Naseeruddin Shah, Vijay Varma, Fatima Sana Shaikh, Sharib Hashmi", badge: "",
        trailer: "trailers/SSYouTube.online_Gustaakh Ishq - Official Trailer  Naseeruddin Shah, Vijay Varma, Fatima Sana Shaikh, Sharib Hashmi_720p.mp4",
        cast: ["Vijay Varma", "Fatima Sana Shaikh", "Naseeruddin Shah", "Sharib Hashmi", "Aditi Rao Hydari"]
    },
    {
        id: 40, title: "Kis Kisko Pyaar Karoon 2", genre: "Comedy", language: "Hindi", format: "2D", rating: 6.5, duration: 128, age: "UA", year: 2025,
        img: "trailers/kis kiso pyar.webp", description: "Comedy, Romance | Cast: Kapil Sharma, Jacqueline Fernandez | T-Series", badge: "",
        trailer: "trailers/SSYouTube.online_KIS KISKO PYAAR KAROON 2 - Official Trailer  Kapil Sharma  Jacqueline Fernandez  T-Series_720p.mp4",
        cast: ["Kapil Sharma", "Jacqueline Fernandez", "Varun Sharma", "Kiku Sharda", "Sonu Nigam"]
    },
    {
        id: 41, title: "Masti 4", genre: "Comedy", language: "Hindi", format: "2D", rating: 6.8, duration: 130, age: "A", year: 2025,
        img: "trailers/masti 4.jpg", description: "Adult Comedy | Cast: Riteish Deshmukh, Vivek Oberoi, Aftab Shivdasani", badge: "21 Nov",
        trailer: "trailers/SSYouTube.online_Masti 4 - Official Teaser  Riteish Deshmukh  Vivek Oberoi  Aftab Shivdasani  21st Nov_720p.mp4",
        cast: ["Riteish Deshmukh", "Vivek Oberoi", "Aftab Shivdasani", "Nora Fatehi", "Sonnalli Seygall"]
    },
    {
        id: 42, title: "Tere Ishk Mein", genre: "Romance", language: "Hindi", format: "2D", rating: 7.3, duration: 140, age: "UA", year: 2025,
        img: "trailers/Tere-Ishk-Mein-Hindi-Movie-Full-Cast-and-Crew-Wiki.jpg", description: "Romance, Drama | Cast: Dhanush, Kriti Sanon | Music: A. R. Rahman | Director: Aanand L Rai", badge: "ARR",
        trailer: "trailers/SSYouTube.online_TERE ISHK MEIN TEASER (Hindi)  Dhanush, Kriti Sanon  A. R. Rahman  Aanand L Rai  Bhushan Kumar_720p.mp4",
        cast: ["Dhanush", "Kriti Sanon", "Radhika Apte", "Vijay Sethupathi", "Sushant Singh"]
    },
    {
        id: 43, title: "Break The Silence", genre: "Thriller", language: "Hindi", format: "2D", rating: 6.7, duration: 125, age: "UA", year: 2025,
        img: "trailers/break the silence.webp", description: "Thriller, Mystery | Cast: Anupriya Goenka, Yukti Kapoor, Rohit Pathak", badge: "",
        trailer: "trailers/SSYouTube.online_Break The Silence - Official Teaser  Anupriya Goenka, Yukti Kapoor, Rohit Pathak_720p.mp4",
        cast: ["Vicky Kaushal", "Tripti Dimri", "Manoj Bajpayee", "Sayani Gupta", "Ashutosh Rana"]
    }
];

const THEATRES_DATA = [
    { id: 1, name: "Shanti Theatre", screens: 1, screenId: "SHHY01", location: "Narayanguda" },
    { id: 2, name: "Deepak 70mm", screens: 1, screenId: "DPHY70", location: "Narayanguda Main Rd" },
    { id: 3, name: "Sapna Theatre", screens: 1, screenId: "SPNHY01", location: "Abids / Koti" },
    { id: 4, name: "Asia Theatre", screens: 1, screenId: "ASHY01", location: "RTC X Roads" },
    { id: 5, name: "Sri Mayuri 70mm", screens: 1, screenId: "SMY70", location: "Musheerabad / RTC X Roads" },
    { id: 6, name: "Sudha 70mm", screens: 1, screenId: "SDH70", location: "Abids" },
    { id: 7, name: "Santosh Theatre", screens: 1, screenId: "SNSH01", location: "Abids / Koti" },
    { id: 8, name: "Sree Rama Theatre", screens: 1, screenId: "SRMHY01", location: "Amberpet" },
    { id: 9, name: "Prasads Multiplex (IMAX + PCX)", screens: 6, screenId: "PRIMX06", location: "Necklace Road / Khairatabad" },
    { id: 10, name: "INOX GVK One", screens: 6, screenId: "INGK06", location: "Banjara Hills" },
    { id: 11, name: "PVR RK Cineplex", screens: 4, screenId: "PVRRK04", location: "Road No. 2, Banjara Hills" },
    { id: 12, name: "Asian Lakshmikala", screens: 4, screenId: "ASLKL04", location: "Moosapet" },
    { id: 13, name: "Cinepolis Mantra Mall", screens: 5, screenId: "CNPMM05", location: "Moosapet / Asif Nagar" },
    { id: 14, name: "INOX Maheshwari Parmeshwari", screens: 4, screenId: "INMP04", location: "Kachiguda / RTC X Roads" },
    { id: 15, name: "Asian Ganga Theatre", screens: 3, screenId: "ASGNG03", location: "Dilsukhnagar" },
    { id: 16, name: "Cinepolis CCPL Mall", screens: 5, screenId: "CNPCP05", location: "Malkajgiri" },
    { id: 17, name: "Sudharshan 35mm", screens: 1, screenId: "SDS35", location: "RTC X Roads" },
    { id: 18, name: "Sree Annapurna Theatre", screens: 1, screenId: "SAPN01", location: "Boduppal" },
    { id: 19, name: "PVR Irrum Manzil (Next Galleria)", screens: 7, screenId: "PVRIM07", location: "Ameerpet" },
    { id: 20, name: "PVR Panjagutta", screens: 6, screenId: "PVRPG06", location: "Panjagutta" },
    { id: 21, name: "INOX Punjagutta City Center", screens: 6, screenId: "INPCC06", location: "Punjagutta" },
    { id: 22, name: "PVR Inorbit Mall", screens: 8, screenId: "PVRIO08", location: "Hitech City" },
    { id: 23, name: "AMB Cinemas", screens: 7, screenId: "AMBJB07", location: "Gachibowli" },
    { id: 24, name: "Asian CineTown Uppal", screens: 5, screenId: "ASUPL05", location: "Uppal" },
    { id: 25, name: "Cinepolis DSL Virtue Mall", screens: 6, screenId: "CNPDL06", location: "Dilsukhnagar" },
    { id: 26, name: "Moviemax Ameerpet", screens: 4, screenId: "MMAMP04", location: "Ameerpet" },
    { id: 27, name: "Asian Jyothi Theatre", screens: 2, screenId: "ASJYT02", location: "L. B. Nagar" },
    { id: 28, name: "Cinetown Gachibowli", screens: 5, screenId: "CNGKB05", location: "Gachibowli" },
    { id: 29, name: "CINEMAX Kukatpally", screens: 5, screenId: "CMXKP05", location: "Kukatpally" },
    { id: 30, name: "PVR Sujana Mall", screens: 8, screenId: "PVRSJ08", location: "Kukatpally / KPHB" }
];

function getNowPlayingMovies() { return MOVIES_DATA.slice(0, 8); }
function getComingSoonMovies() { return MOVIES_DATA.slice(8, 15); }
function getMovieById(id) { return MOVIES_DATA.find(m => m.id === parseInt(id)); }
function getMovieByTitle(title) { return MOVIES_DATA.find(m => m.title === decodeURIComponent(title)); }
function getTheatres() { return THEATRES_DATA; }
