import { collection, onSnapshot, query, doc, getDoc, where, or, and } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

/**
 * التصحيح النهائي: اسم المجموعة في الفايربيس هو 'collection id' حرفياً كما في الصورة
 */
export const subscribeToProducts = (callback: (products: Product[]) => void, categoryFilter?: string) => {
  let q = query(collection(db, 'collection id'));
  
  if (categoryFilter && categoryFilter !== 'ALL') {
    const filterUpper = categoryFilter.toUpperCase().trim();
    let values: string[] = [];

    if (filterUpper === 'MEN' || filterUpper === 'MAN') {
      values = ['man', 'men', 'MAN', 'MEN', 'Man', 'Men'];
    } else if (filterUpper === 'WOMEN' || filterUpper === 'WOMAN') {
      values = ['woman', 'women', 'WOMAN', 'WOMEN', 'Woman', 'Women'];
    } else if (filterUpper === 'PERFUME' || filterUpper === 'PERFUM') {
      values = [
        'perfum', 'perfume', 'PERFUME', 'Perfume', 'Perfum', 
        'perfumes', 'PERFUMES', 'Perfumes',
        'women perfume', 'women\'s perfume', 'woman perfume',
        'men perfume', 'men\'s perfume', 'man perfume'
      ];
    } else if (filterUpper === 'SHOES & BAGS' || filterUpper === 'SHOES&BAG' || filterUpper === 'SHOES AND BAG' || filterUpper === 'SHOES & BAG') {
      values = ['shoes&bag', 'shoes and bag', 'shoes & bags', 'shoes&bags', 'SHOES&BAG', 'SHOES AND BAG', 'SHOES & BAGS', 'Shoes & Bags'];
    } else if (filterUpper === 'ACCESSORIES') {
      values = ['accessories', 'ACCESSORIES', 'Accessories'];
    } else {
      values = [categoryFilter, categoryFilter.toLowerCase(), categoryFilter.toUpperCase()];
    }

    // Use OR query to check both category and category2
    q = query(
      collection(db, 'collection id'), 
      or(
        where('category', 'in', values),
        where('category2', 'in', values)
      )
    );
  }
  
  return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    if (snapshot.empty) {
      callback([]);
      return;
    }

    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      // نتحقق من الاسم الصحيح والاسم الذي به خطأ إملائي في فيربيز
      const detailImgs = data.detaillmages || data.detailImages || [];
      
      return {
        id: doc.id,
        name: data.name || 'Untitled',
        price: Number(data.price) || 0,
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : 99,
        mainImage: data.mainImage || '',
        hovering: data.hovering || data.mainImage || '',
        detailImages: Array.isArray(detailImgs) ? detailImgs : [],
        category: String(data.category || '').toLowerCase().trim(),
        category2: data.category2 ? String(data.category2).toLowerCase().trim() : undefined,
        gender: data.gender || '',
        gender2: data.gender2 || '',
        isFeatured: data.isFeatured === true,
        underVideo: data.underVideo === true,
        description: data.description || '',
        sizes: data.sizes || [],
        colors: data.colors || []
      } as Product;
    });
    
    callback(products);
  }, (error) => {
    console.error("Firestore Error:", error.message);
    callback([]);
  });
};

export const subscribeToUnderVideoByGender = (gender: string, callback: (products: Product[]) => void) => {
  // نقوم بتجهيز قائمة بالقيم المحتملة للجنس لضمان جلب البيانات سواء كانت مفرد أو جمع وبكل حالات الأحرف
  const g = gender.toLowerCase();
  let genderValues = g === 'men' || g === 'man' 
    ? ['man', 'men', 'MAN', 'MEN', 'Man', 'Men'] 
    : ['woman', 'women', 'WOMAN', 'WOMEN', 'Woman', 'Women'];

  // Always include UNISEX for both men and women filtering if that's the intent
  // Or handle UNISEX specifically if requested. 
  // The user says: "When I press [Unisex], it puts it in the Unisex."
  // So if we are filtering for Men, we might want to show Men + Unisex.
  if (g === 'men' || g === 'man' || g === 'women' || g === 'woman') {
    // UNISEX filter removed by user request
  }

  const q = query(
    collection(db, 'collection id'),
    and(
      or(
        where("gender", "in", genderValues),
        where("gender2", "in", genderValues)
      ),
      where("underVideo", "==", true)
    )
  );
  
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      const detailImgs = data.detaillmages || data.detailImages || [];
      return {
        id: doc.id,
        name: data.name || 'Untitled',
        price: Number(data.price) || 0,
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : 99,
        mainImage: data.mainImage || '',
        hovering: data.hovering || data.mainImage || '',
        detailImages: Array.isArray(detailImgs) ? detailImgs : [],
        category: String(data.category || '').toLowerCase().trim(),
        gender: data.gender || '',
        gender2: data.gender2 || '',
        isFeatured: data.isFeatured === true,
        underVideo: data.underVideo === true,
        description: data.description || '',
        sizes: data.sizes || [],
        colors: data.colors || []
      } as Product;
    });
    callback(products);
  }, (error) => {
    console.error(`Firestore Error in under video by gender (${gender}):`, error.message);
    callback([]);
  });
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    const unsub = subscribeToProducts((products) => {
      // Resolve regardless of length so we don't hang if Firestore is empty or fails
      resolve(products);
      unsub();
    });
  });
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const all = await fetchAllProducts();
  return all.filter(p => p.isFeatured === true);
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    // نحاول أولاً في مجموعة المتجر الأساسية
    const docRef = doc(db, 'collection id', id);
    let docSnap = await getDoc(docRef);
    
    // إذا لم توجد، نحاول في مجموعة الصفحة الرئيسية
    if (!docSnap.exists()) {
      const featRef = doc(db, 'main_featured', id);
      docSnap = await getDoc(featRef);
    }

    if (docSnap.exists()) {
      const data = docSnap.data();
      const detailImgs = data.detaillmages || data.detailImages || [];
      
      return { 
        id: docSnap.id, 
        name: data.name || '',
        price: Number(data.price) || 0,
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : 99,
        mainImage: data.mainImage || '',
        hovering: data.hovering || data.mainImage || '',
        detailImages: Array.isArray(detailImgs) ? detailImgs : [],
        category: String(data.category || '').toLowerCase().trim(),
        gender: data.gender || '',
        gender2: data.gender2 || '',
        isFeatured: data.isFeatured === true,
        description: data.description || '',
        sizes: data.sizes || [],
        colors: data.colors || []
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

/**
 * جلب قطع الصفحة الرئيسية الحصرية من مجموعة منفصلة
 */
export const subscribeToMainFeatured = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, 'main_featured'));
  
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => {
      const data = doc.data();
      const detailImgs = data.detaillmages || data.detailImages || [];
      return {
        id: doc.id,
        name: data.name || 'Untitled',
        price: Number(data.price) || 0,
        oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
        stock: data.stock !== undefined ? Number(data.stock) : 99,
        mainImage: data.mainImage || '',
        hovering: data.hovering || data.mainImage || '',
        detailImages: Array.isArray(detailImgs) ? detailImgs : [],
        category: 'featured',
        gender: data.gender || '',
        gender2: data.gender2 || '',
        isFeatured: data.isFeatured === true,
        underVideo: data.underVideo === true,
        description: data.description || '',
        sizes: data.sizes || [],
        colors: data.colors || []
      } as Product;
    });
    callback(products);
  }, () => callback([]));
};
