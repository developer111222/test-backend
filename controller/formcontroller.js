const Form=require('../model/formmodel');


//-----------------------------create form----------------------------------

exports.createForm=async(req,res)=>{

    try {
        const { name, email, phone, question } = req.body;
        console.log(req.body)

        // Validate required fields
        if (!name || !question || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if email or phone already exists
        const existingEmail = await Form.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingPhone = await Form.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        const form = new Form({
          name,
            email,
            phone,
            question
           
        });

        await form.save();

      return  res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        
      return  res.status(500).json({ message: 'Server error',error: error.message });
    }
};


//-----------------------------get all forms----------------------------------

exports.getAllForms=async(req,res)=>{

    try {
        const forms = await Form.find();
        return res.status(200).json({ forms });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};  


//--------------------------------delete form----------------------------------


exports.deleteForm=async(req,res)=>{

    try {
        const formId = req.params.id;

        const form = await Form.findByIdAndDelete(formId);

        return res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error while deleting form', error: error.message });
    }
}