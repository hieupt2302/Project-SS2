const { Recipe } = require('../models/Recipe');
const { Users } = require('../models/User');

const fetchAndSaveUsers = async () => {
  const dataset = 'AkashPS11/recipes_data_food.com';
  const config = 'default';
  const split = 'train';
  const limit = 100;
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < 1200) {
    const url = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(dataset)}&config=${config}&split=${split}&offset=${offset}&length=${limit}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const rows = data.rows;

      if (!rows || rows.length === 0) {
        hasMore = false;
        console.log('✅ Đã fetch xong user data!');
        break;
      }

      const recipes = rows.map(row => row.row);

      for (const recipe of recipes) {
        const authorName = recipe.AuthorName || 'Unknown Author';
        try {
          await Users.findOrCreate({
            where: { name: authorName },
            defaults: {
              email: `${authorName.replace(/\s+/g, '').toLowerCase()}@gmail.com`, // tạo email giả
              password: '', // hoặc random
              role: 'user',
            }
          });
        } catch (err) {
          console.error('❌ Lỗi khi lưu user:', err.message);
        }
      }

      offset += limit;
      console.log(`✅ Fetched and saved ${recipes.length} users (offset ${offset})`);

    } catch (err) {
      console.error('❌ Lỗi khi fetch users:', err.message);
      hasMore = false;
    }
  }
};


const fetchAndSaveRecipes = async () => {
  const dataset = 'AkashPS11/recipes_data_food.com';
  const config = 'default';
  const split = 'train';
  const limit = 100;
  let offset = 0;
  let hasMore = true;

  while (hasMore && offset < 1200) {
    const url = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(dataset)}&config=${config}&split=${split}&offset=${offset}&length=${limit}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const rows = data.rows;

      if (!rows || rows.length === 0) {
        hasMore = false;
        console.log('✅ Đã fetch xong recipe data!');
        break;
      }

      const recipes = rows.map(row => row.row);

      for (const recipe of recipes) {
        try {
          // Tìm user
          const authorName = recipe.AuthorName || 'Unknown Author';
          const user = await Users.findOne({ where: { name: authorName } });

          if (!user) {
            console.warn(`⚠ Không tìm thấy user cho author: ${authorName}`);
            continue;
          }

          await Recipe.findOrCreate({
            where: { name: recipe.Name, authorID: user.id },
            defaults: {
              authorID: user.id,
              author_name: authorName,
              cook_time: recipe.CookTime,
              prep_time: recipe.PrepTime,
              total_time: recipe.TotalTime,
              Images: recipe.Images || '',
              RecipeCategory: recipe.RecipeCategory,
              RecipeIngredientQuantities: JSON.stringify(recipe.RecipeIngredientQuantities),
              RecipeIngredientParts: JSON.stringify(recipe.RecipeIngredientParts),
              AggregatedRating: recipe.AggregatedRating,
              Calories: recipe.Calories,
              FatContent: recipe.FatContent,
              FiberContent: recipe.FiberContent,
              SugarContent: recipe.SugarContent,
              ProteinContent: recipe.ProteinContent,
              RecipeInstructions: JSON.stringify(recipe.RecipeInstructions),
            }
          });
        } catch (err) {
          console.error('❌ Lỗi khi lưu recipe:', err.message);
        }
      }

      offset += limit;
      console.log(`✅ Fetched and saved ${recipes.length} recipes (offset ${offset})`);

    } catch (err) {
      console.error('❌ Lỗi khi fetch recipes:', err.message);
      hasMore = false;
    }
  }
};

module.exports = { fetchAndSaveUsers, fetchAndSaveRecipes }; 
