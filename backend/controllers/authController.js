const pool = require("../db/connections");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();



// 1) The signup function 
export const signup = async(req,res)=>{

      try{

        const {email, password} = req.body;

        const Res = await pool.query( " select * from users where email= $1",[email] );


        if(Res.rows.length > 0){ return res.status(409).json( { message:"user already exists" } )};

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertResult = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hashedPassword] );

    const user = insertResult.rows[0];
    
    const token = jwt.sign( { id:user.id, email: user.email },
                              process.env.JWT_SECRET,
                            { expiresIn: "10d" } );
 
        res.cookie("jwt",token, {httpOnly: true,
                                 maxAge: 10 * 24 * 60 * 60 * 1000,
                                 secure: process.env.NODE_ENV === "production",})

        return res
                  .status(201)
                  .json({
                         message: "User created successfully",
                         user})
                  
        } catch (err) {
            
            console.error(err);
            return res.status(500).json({
            message: "Internal server error", });  }


}




// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",}); }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password", });}  // the password did not match


    // create the token    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10d" });


    // store the token in a cookie  
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,});

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,},  });

  } catch (err) {

    console.error(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};