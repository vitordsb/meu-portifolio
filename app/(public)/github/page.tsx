import { redirect } from "next/navigation";

// /github agora redireciona pro perfil real — sem expor lista de repos no portfolio.
export default function GithubRedirect() {
  redirect("https://github.com/vitordsb");
}
