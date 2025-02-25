const Banner = require('../model/bannermodel');

//--------------create banner------------------
exports.createBanner = async (req, res, next) => {
    console.log(req.file, req.body);
    try {
        const { title, description, link } = req.body;
        const image = req.file.filename;

        if (!title || !description || !link || !image) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const banner = new Banner({ title, description, link, image });
        await banner.save();
        return res.status(200).json({ message: "Banner created successfully", banner });
    } catch (error) {
        return res.status(500).json({ message: "Server error while creating banner", error });
    }
}

//--------------get all banners------------------

exports.getAllBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find({});
        return res.status(200).json({ message: "Banners retrieved successfully", banners });
    } catch (error) {
        return res.status(500).json({ message: "Server error while retrieving banners", error });
    }
}


//--------------update banner------------------

exports.updateBanner = async (req, res, next) => {
    try {
        const { title, description, link } = req.body;
        const bannerId = req.params.id;

        const image = req.file ? req.file.filename : null;

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                message: 'Banner not found',
            });
        }
        console.log(banner);

        const updatedData = {};

        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (link) updatedData.link = link;

        // Don't update the image if no new image is uploaded
        if (image !== null) {
            updatedData.image = image;
        } else {
            // Keep the old image if no new image is uploaded
            updatedData.image = banner.image;
        }

        const updatedBanner = await Banner.findByIdAndUpdate(
            bannerId,
            updatedData,
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: 'Banner updated successfully',
            banner: updatedBanner,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error while updating banner',
            error: error.message,
        });
    }
};

//--------------delete banner------------------

exports.deleteBanner = async (req, res, next) => {
    try {
        const bannerId = req.params.id;

        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                message: 'Banner not found',
            });
        }

        await Banner.findByIdAndDelete(bannerId);

        return res.status(200).json({
            message: 'Banner deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error while deleting banner',
            error: error.message,
        });
    }
};