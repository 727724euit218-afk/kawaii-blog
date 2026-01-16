const { db, initializeDatabase } = require('./database');

// Default blog posts to populate on first run
const defaultPosts = [
    {
        title: "The Bus Diaries 🚌",
        category: "lifestyle",
        excerpt: "Hey! It's been a while, hasn't it? Life's been such a whirlwind lately that I almost forgot I own a blog page. But today, I want to write about something we all experience, yet often overlook in the chaos of our mechanical lives: travel. And no, I don't just mean those Instagram worthy trips to exotic destinations...",
        content: "I'm talking about the everyday journeys—the bus rides, the metro commutes, the walks to the corner store. These seemingly mundane moments hold so much beauty if we just pause and observe. The other day, I was on my usual bus route, and instead of scrolling through my phone, I looked out the window. The way the sunlight filtered through the trees, the conversations of strangers, the rhythm of the city—it all felt like poetry in motion. Travel isn't just about reaching a destination; it's about the journey itself. So next time you're on a bus, train, or even walking down the street, take a moment to soak it all in. You might be surprised by what you discover. ✨",
        created_at: "2025-06-21"
    },
    {
        title: "The Plot Twist? 🎬",
        category: "reflection",
        excerpt: "Remember when Vijayna in Nanban said, \"Oru nimisham unga life-ah ellarum rewind pani parunga\"? Yup, that's exactly what this post is about. I know, I know, it's a total cliché intro for an even more cliché topic, but hey, it's that time of the year where we all get nostalgic and do this anyway. 2025 is just around the corner...",
        content: "And as I sit here reflecting on 2024, I can't help but think about all the plot twists this year threw at me. Some were beautiful surprises, others were challenges I never saw coming. But isn't that what makes life interesting? The unpredictability of it all? This year taught me resilience, patience, and the importance of embracing change. I learned that it's okay to not have everything figured out, and that sometimes the best moments come from the most unexpected places. As we step into a new year, I'm carrying these lessons with me. Here's to more plot twists, more growth, and more adventures in 2025! 🎉",
        created_at: "2024-12-26"
    },
    {
        title: "\"Trend\"? 📱",
        category: "social",
        excerpt: "Hey there! How's it going? I hope you're doing great. Today, I felt like diving into something a bit more serious, something we don't talk about enough. So here is my opinion (or call it a rant) about it. Everyone's all about Instagram these days, right? But have you ever stopped to think, is what we see really real?",
        content: "Trends come and go, but the pressure to keep up with them is constant. We're bombarded with perfectly curated feeds, aesthetic photos, and highlight reels that make us question our own lives. But here's the thing: social media is just a snapshot, not the full picture. Behind every \"perfect\" post is a person with their own struggles, insecurities, and messy moments. I think it's time we start being more authentic online. Let's celebrate the imperfections, the real moments, the unfiltered experiences. Because at the end of the day, what truly matters isn't how many likes we get, but how genuine our connections are. So let's break free from the trend cycle and just be ourselves. 💖",
        created_at: "2024-08-14"
    },
    {
        title: "Hi!! its me Mii 🙂",
        category: "intro",
        excerpt: "Hello! I'm Sangamitra Pugal (aka) Mitra. I am a 17 year old teen and this is my blog that documents my journey. I write about things that fascinate me so join me on this whimsical journey, and let's sprinkle a little more joy and laughter into our everyday lives, cheers!!",
        content: "I created this blog as a space to share my thoughts, experiences, and all the little things that make life special. Whether it's reflections on everyday moments, rants about social media, or stories from my daily adventures, this is where I pour my heart out. I believe that life is a beautiful journey filled with ups and downs, and I want to document it all here. I'm passionate about creativity, good vibes, and spreading positivity. So grab a cup of tea, get cozy, and let's embark on this journey together. Welcome to my little corner of the internet! 🌸✨",
        created_at: "2024-07-25"
    }
];

async function seedDatabase() {
    try {
        // Check if posts already exist
        db.get('SELECT COUNT(*) as count FROM posts', [], async (err, row) => {
            if (err) {
                console.error('Error checking posts:', err);
                return;
            }

            // Only seed if database is empty
            if (row.count === 0) {
                console.log('📝 Database is empty. Adding default posts...');

                for (const post of defaultPosts) {
                    await new Promise((resolve, reject) => {
                        db.run(
                            `INSERT INTO posts (title, content, excerpt, category, author_id, published, created_at) 
                             VALUES (?, ?, ?, ?, 1, 1, ?)`,
                            [post.title, post.content, post.excerpt, post.category, post.created_at],
                            function (err) {
                                if (err) {
                                    console.error(`❌ Error adding "${post.title}":`, err.message);
                                    reject(err);
                                } else {
                                    console.log(`✅ Added: ${post.title}`);
                                    resolve();
                                }
                            }
                        );
                    });
                }

                console.log('🎉 Default posts added successfully!');
            } else {
                console.log(`✅ Database already has ${row.count} posts. Skipping seed.`);
            }
        });
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

module.exports = { seedDatabase };
