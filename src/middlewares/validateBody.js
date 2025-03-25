
export const validateBody = (schema) => {
  return (req, res, next) => {
    console.log('Request body:', req.body);

   
    const { error } = schema.validate(req.body, { 
      abortEarly: false,  
      convert: true,      
      stripUnknown: true  
    });

   
    if (error) {
      console.error('Validation errors:', error.details);

      
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'), 
        type: detail.type,         
        message: detail.message       
      }));

      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Validation Error',
        errors: validationErrors
      });
    }

    next();
  };
};