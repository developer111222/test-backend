const Newsletter = require('../model/newslettermodel');

//---------------------------------create newsletter------------------


exports.createnewsletter = async (req, res) => {
    try {

        const email = req.body;

        if (!email) {
            return res.status(400).json({ message: "please fill out the email" })
        }

        const existingNewsletter = await Newsletter.findOne(email);

        if (existingNewsletter) {
            return res.status(401).json({ message: "email already exist" })
        }

        const newsletter = new Newsletter(email);
        await newsletter.save();

        return res.status(200).json({ message: "created successfully" })

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


//-----------------------------get newsletter------------------

exports.getnewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.find();
        return res.status(200).json(newsletter)
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


//---------------------------------delete newsletter-----------------------------------


exports.deletenewsletter = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)

        const newsletter = await Newsletter.findByIdAndDelete(id);

        return res.status(200).json({ message: "deleted successfully" })


    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}