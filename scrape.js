const puppeteer = require("puppeteer");
const path = require("path");
const https = require("https");
const http = require("http");

//const getListings = require('./getAllListings');
//const getListingContent = require('./getAllListingsData');
//const columnData = require('./columnDataExtraction');
const getAllBrands = require("./laVaporData/getAllBrands");
const columnDataExtraction = require("./columnDataExtraction");
const fs = require("fs");
const writeToExcelWithExcelJs = require("./laVaporData/writeToExcelWithExcelJs");
const writeToExcelMatchingData = require("./laVaporData/writeToExcelWithXLSX");

const getLaVaporData = async (page) => {
  const listItems = await page.evaluate(() => {
    const allListItems = document
      .querySelectorAll(".facets__disclosure")[2]
      .querySelectorAll("li");
    const listItemsText = Array.from(allListItems).map((item) =>
      item.textContent.trim()
    );
    return listItemsText;
  });

  for (let index = 0; index < listItems.length; index++) {
    const brand = listItems[index];
    await page.goto(
      `https://lavaporwholesale.com/collections/nicotine-freebase?filter.v.price.gte=&filter.v.price.lte=&filter.p.m.custom.brand_name=${brand}&sort_by=created-descending`,
      {
        waitUntil: "networkidle0",
      }
    );

    const productNames = await getAllBrands(page);
    writeToExcelWithExcelJs([
      {
        brand,
        productNames,
      },
    ]);
  }
};

const matchLaVaporData = async (page) => {
  const collectionName = await page.evaluate(() => {
    return document
      .querySelectorAll(".heading span")[1]
      .textContent.toLowerCase()
      .replace(/\s/g, "");
  });
  const productsWithBrands = await columnDataExtraction(
    "product_data.xlsx",
    "Products",
    "B"
  );
  const brands = await columnDataExtraction(
    "product_data.xlsx",
    "Products",
    "A"
  );
  // Create an array to store products with brands
  const productsWithBrandsArray = [];

  // Iterate over the productsWithBrands array
  productsWithBrands.forEach((product, index) => {
    // Create an object to store the product and its corresponding brand
    const productWithBrand = {
      productName: product,
      brand: brands[index],
    };
    // Push the object to the productsWithBrandsArray
    productsWithBrandsArray.push(productWithBrand);
  });

  // Read the content of the JSON file synchronously
  const jsonData = fs.readFileSync(
    "filtered_products_with_brands.json",
    "utf-8"
  );

  // Parse the JSON data to JavaScript objects
  const products = JSON.parse(jsonData);
  const matchedProducts = [];

  // Iterate over each product in the products JSON
  products.forEach((product) => {
    // Find the matching product in productsWithBrandsArray
    const matchingProduct = productsWithBrandsArray.find(
      (item) => item.productName === product.Title
    );
    // If a matching product is found, add the brand information to the product JSON

    if (matchingProduct) {
      product.Tags = matchingProduct.brand;
      matchedProducts.push(product);
    }
  });
  writeToExcelMatchingData(matchedProducts, collectionName);
};

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (error) => {
        fs.unlink(filepath, () => reject(error));
      });
  });
};

const main = async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint:
      "ws://127.0.0.1:9222/devtools/browser/8a5a58f5-9579-429e-a327-3b8b40ab26d9",
    protocolTimeout: 300000, // Increase the timeout to 5 minutes (300000 ms)
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });
  //here goes the url for the page
  //const url = 'https://fbamembers.com/franlink-system/'

  const columnData = await columnDataExtraction(
    "FBA/excelFiles/listings2.xlsx",
    "Sheet1",
    "A"
  );
  console.log(columnData);

  for (let index = 874; index < columnData.length; index++) {
    await page.goto(columnData[index], {
      waitUntil: "networkidle0",
    });
    try {
      const response = await page.goto(columnData[index], {
        waitUntil: "networkidle0",
      });

      if (response.status() === 404) {
        console.log(`Page not found: ${columnData[index]}`);
        continue; // Move to the next URL in case of a 404 error
      }

      await page.waitForSelector(".button.tertiary-button");

      const documents = await page.evaluate(async () => {
        // //remove item button
        const itemButtons = document.querySelectorAll(
          ".button.tertiary-button"
        );
        const urls = [];
        itemButtons.forEach(async (btn) => {
          const url = btn.getAttribute("href");
          urls.push(url);
        });

        return urls;
      });

      (async () => {
        try {
          const downloadDir = path.resolve(__dirname, "uploads");
          if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir);
          }

          for (const url of documents) {
            if (url.includes("s26232.pcdn.co")) {
              const filename = url.split("/").pop().split("?")[0];
              const filepath = path.join(downloadDir, filename);
              await downloadImage(url, filepath);
              console.log(`Downloaded: ${url} as ${filename}`);
            }
          }
        } catch (error) {
          console.error(`Failed to download file: ${error.message}`);
        }
      })();
    } catch (error) {
      console.log(`Error navigating to: ${columnData[index]}`);
      console.log(error);
      continue; // Move to the next URL in case of any other errors
    }
  }

  // const images = await page.evaluate(async () => {
  //   const inputChecked = document.querySelector(
  //     ".mt-2.flex.items-center > input"
  //   );
  //   inputChecked.click();

  //   let imgs = document.querySelectorAll(
  //     ".object-contain.w-full.h-full.block.pt-2.pb-4.m-0"
  //   );
  //   const isNextPageButtonDisabled = () => {
  //     const nextPageButton = document.querySelectorAll(
  //       "#pagination-header button"
  //     )[3];
  //     return nextPageButton.disabled;
  //   };

  //   while (!isNextPageButtonDisabled()) {
  //     const nextPageButton = document.querySelectorAll(
  //       "#pagination-header button"
  //     )[3];
  //     nextPageButton.click(); // Click on the next page button
  //     await new Promise((resolve) => setTimeout(resolve, 6000)); // Wait for a moment
  //     let nextPageImgs = document.querySelectorAll(
  //       ".object-contain.w-full.h-full.block.pt-2.pb-4.m-0"
  //     );
  //     imgs = [...imgs, ...nextPageImgs];
  //   }
  //   let nextPageImgs = document.querySelectorAll(
  //     ".object-contain.w-full.h-full.block.pt-2.pb-4.m-0"
  //   );

  //   imgs = [...imgs, ...nextPageImgs];
  //   const namesImgs = [];
  //   imgs.forEach((img) => {
  //     const src = img.getAttribute("src");
  //     const name = img.parentElement.nextElementSibling.children[0].textContent;
  //     namesImgs.push({
  //       name,
  //       src,
  //     });
  //   });

  //   return namesImgs;
  // });

  // console.log(images);

  // const downloadDir = path.resolve(__dirname, "downloaded_images");
  // if (!fs.existsSync(downloadDir)) {
  //   fs.mkdirSync(downloadDir);
  // }

  // for (let index = 0; index < images.length; index++) {
  //   const newName = images[index].name.replace(/[^\w-]/g, "");
  //   const filepath = path.join(downloadDir, `${newName}.jpg`);
  //   try {
  //     await downloadImage(images[index].src, filepath);
  //     console.log(`Downloaded: ${images[index].src}`);
  //   } catch (error) {
  //     console.error(
  //       `Failed to download ${images[index].src}: ${error.message}`
  //     );
  //   }
  // }

  //await getListingContent(page)
  //}

  //await getListings(page)

  // LAVAPOR
  //   await getLaVaporData(page);
  //   await matchLaVaporData(page);
};

main();
