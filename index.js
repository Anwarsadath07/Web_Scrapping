// // import axios from 'axios';
// // import cheerio from 'cheerio';
// // import express from 'express';

// // const PORT = process.env.PORT || 5000;

// // const app = express();

// // axios("http://books.toscrape.com/")
// //   .then(res => {
// //     const htmlData = res.data;
// //     const $ = cheerio.load(htmlData);
// //     const articles = [];

// //     $(".product_pod", htmlData).each((index, element) => {
// //       const title = $(element).text();
// //       const titleURL = $(element).attr('href');
// //       articles.push({
// //         title,
// //         titleURL,
// //       });
// //     });
// //     console.log(articles); // Logging articles outside the loop to avoid repeated logging
// //   })
// //   .catch(err => console.log(err));

// // app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
// import axios from 'axios';
// import cheerio from 'cheerio';
// import express from 'express';
// import { MongoClient } from 'mongodb';

// const PORT = process.env.PORT || 5000;
// const MONGODB_URI = 'mongodb://localhost:27017/scrape'; // Assuming MongoDB is running locally

// const app = express();

// axios("http://books.toscrape.com/")
//   .then(async res => {
//     const htmlData = res.data;
//     const $ = cheerio.load(htmlData);
//     const articles = [];

//     $(".product_pod", htmlData).each((index, element) => {
//       const title = $(element).find('h3 > a').attr('title');
//       const titleURL = $(element).find('h3 > a').attr('href');
//       articles.push({
//         title,
//         titleURL,
//       });
//     });

//     // Connect to MongoDB
//     const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
//     await client.connect();

//     // Select the database
//     const db = client.db('scrape');

//     // Insert the articles into a collection
//     const collection = db.collection('articles');
//     await collection.insertMany(articles);

//     // Close the connection
//     await client.close();
//   })
//   .catch(err => console.log(err));

// app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
import axios from 'axios';
import cheerio from 'cheerio';
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title: String,
    createdAt: { type: Date, default: Date.now }
});


const News = mongoose.model('News', newsSchema);


const MONGODB_URI = 'mongodb://localhost:27017/New1';


mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

async function scrapeBBCNews() {
    const url = "http://books.toscrape.com/";

    try {
        const response = await axios.get(url);
        const htmlData = response.data;
        const $ = cheerio.load(htmlData);
        const newsHeadlines = $(".product_pod");

        const newsArticle = [];

        newsHeadlines.each((index, element) => {
            const title = $(element).find('h3 > a').text();
            const news = new News({ title });
            newsArticle.push(news);
            console.log(title);
        });

        await News.insertMany(newsArticle);
    } catch (error) {
        console.error(error);
    }
}

scrapeBBCNews();

