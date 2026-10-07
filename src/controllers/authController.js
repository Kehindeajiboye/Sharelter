

const createNewUser = async (req, res) => {
    const {error, value} = signupSchema.validate(req.body, { abortEarly: false });
    console.log("Validation result:", { error, value });


    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details.map(detail => detail.message)
        });
    }
}