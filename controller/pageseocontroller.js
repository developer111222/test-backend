const PageSEO=require('../model/pageseomodel');


//-----------------------------create page seo----------------------------------

exports.createPageSEO=async(req,res)=>{

    try {
        const { meta_title, meta_description, meta_keywords,page_url } = req.body;

        // Validate required fields
        if (!meta_title || !meta_description || !meta_keywords || !page_url) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new page SEO
        const newPageSEO = new PageSEO({
            meta_title,
            meta_description,
            meta_keywords,
            page_url,
            
        });

        // Save to database
        await newPageSEO.save();

        return res.status(201).json({ message: 'Page SEO created successfully', data: newPageSEO });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};