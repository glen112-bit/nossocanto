// server/src/controllers/userController.ts (Função registerUser)

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    // O Multer salva o arquivo no disco e preenche req.file
    const filePath = req.file?.path; 

    // O Multer já fez o upload, mas o arquivo deve ser removido se o registro falhar
    if (!filePath) {
        return res.status(400).json({ message: 'Arquivo de imagem de perfil é obrigatório.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            profileImagePath: filePath, // <--- SALVA O CAMINHO DA FOTO AQUI
        });

        await newUser.save();

        // O registro foi bem-sucedido
        res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });

    } catch (error: any) {
        // MUITO IMPORTANTE: Se o registro no MongoDB falhar (ex: duplicate key),
        // você precisa EXCLUIR o arquivo que o Multer já salvou no disco.
        if (filePath) {
             // Use fs.unlinkSync ou fs.promises.unlink para deletar o arquivo
             const fs = require('fs'); 
             fs.unlinkSync(filePath); 
        }
        
        console.error('Erro no registro:', error);
        return res.status(500).json({ message: 'Erro interno ao registrar usuário.' });
    }
};
