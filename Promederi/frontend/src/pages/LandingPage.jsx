import { Link } from "react-router-dom";
import { ArrowRight, Check, ClipboardList, HeartHandshake, HeartPulse, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import helenaPhoto from "@/assets/helena-soares.jpg";
import lucianaPhoto from "@/assets/luciana-ribeiro.jpg";

const resources = [
  { icon: ClipboardList, title: "Uma rotina mais organizada", text: "Medicações, atividades e anotações reunidas para acompanhar os detalhes do dia." },
  { icon: Users, title: "Família e cuidadores próximos", text: "Informações do cuidado em um só lugar para facilitar o acompanhamento de quem você ama." },
  { icon: HeartPulse, title: "Um olhar para cada detalhe", text: "Sinais vitais e histórico de registros ajudam a entender como foi o dia e o que precisa de atenção." },
];

function Brand() {
  return <span className="flex items-center gap-2 font-heading text-2xl font-semibold text-primary"><span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground"><HeartPulse aria-hidden="true" className="size-6" /></span>Promedéri</span>;
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-4">Pular para o conteúdo</a>
      <header className="border-b border-border">
        <nav aria-label="Navegação principal" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <Link to="/" aria-label="Promedéri — início"><Brand /></Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#recursos" className="hover:text-primary">O cuidado</a>
            <a href="#como-funciona" className="hover:text-primary">Como funciona</a>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="shadow-none"><Link to="/login">Entrar <ArrowRight aria-hidden="true" /></Link></Button>
            <Button asChild className="shadow-none"><Link to="/cadastro">Criar conta</Link></Button>
          </div>
        </nav>
      </header>

      <main id="conteudo">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24" aria-labelledby="hero-title">
          <div>
            <h1 id="hero-title" className="max-w-xl font-heading text-5xl font-semibold leading-tight text-primary sm:text-6xl">Cuidar de quem você ama começa com estar perto!</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-muted-foreground">Mesmo quando a distância faz parte da rotina, o cuidado pode continuar próximo. Acompanhe o dia a dia, conecte-se aos cuidadores e reúna as informações que importam.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 shadow-none"><Link to="/cadastro">Começar a cuidar <ArrowRight aria-hidden="true" /></Link></Button>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold text-primary"><span>Um olhar para a rotina</span><span className="rounded-full border border-border bg-background px-3 py-1">Exemplo ilustrativo</span></div>
            <article className="rounded-lg border border-border bg-card p-5 sm:p-7" aria-label="Exemplo de acompanhamento familiar">
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <img src={helenaPhoto} alt="" width="816" height="816" className="size-20 rounded-full border-4 border-highlight object-cover" />
                <div><p className="text-xs font-semibold text-emergency">Acompanhamento familiar</p><h2 className="mt-1 font-heading text-2xl font-semibold text-primary">O dia de Helena</h2><p className="mt-1 text-sm text-muted-foreground">Cada cuidado tem seu lugar.</p></div>
              </div>
              <div className="my-5 grid grid-cols-2 gap-3">
                {[['Pressão', '12/8', 'mmHg'], ['Temperatura', '36,4', '°C']].map(([label, value, unit]) => <div key={label} className="rounded-lg border border-border bg-background p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-heading text-3xl font-semibold text-primary">{value} <span className="font-body text-xs font-normal text-muted-foreground">{unit}</span></p></div>)}
              </div>
              <div className="flex gap-3"><span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check aria-hidden="true" className="size-4" /></span><div><p className="text-xs font-semibold text-muted-foreground">08:00 · Rotina da manhã</p><h3 className="mt-1 font-semibold text-primary">Cuidado registrado</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">Um novo registro para a família acompanhar.</p></div></div>
            </article>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-primary p-4 text-primary-foreground"><img src={lucianaPhoto} alt="" width="816" height="816" className="size-11 rounded-full object-cover" /><div><p className="text-xs">Quem cuida também faz parte.</p><p className="mt-1 text-sm font-semibold">Luciana · Cuidadora</p></div><HeartHandshake aria-hidden="true" className="ml-auto size-6 shrink-0" /></div>
          </div>
        </section>

        <section id="recursos" className="scroll-mt-6 border-y border-border bg-card" aria-labelledby="resources-title">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <p className="text-sm font-semibold text-emergency">Mais clareza no dia a dia</p>
            <h2 id="resources-title" className="mt-2 max-w-2xl font-heading text-3xl font-semibold text-primary sm:text-4xl">Menos informações espalhadas.<br />Mais espaço para o cuidado.</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">{resources.map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-border pt-6"><span className="grid size-11 place-items-center rounded-lg bg-muted text-primary"><Icon aria-hidden="true" className="size-5" /></span><h3 className="mt-5 font-heading text-xl font-semibold text-primary">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>)}</div>
          </div>
        </section>

        <section id="como-funciona" className="mx-auto grid max-w-7xl scroll-mt-6 gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-20" aria-labelledby="steps-title">
          <div><p className="text-sm font-semibold text-emergency">Um começo simples</p><h2 id="steps-title" className="mt-2 max-w-md font-heading text-3xl font-semibold text-primary sm:text-4xl">Cada pessoa importa.<br />Cada registro também.</h2><p className="mt-5 max-w-md leading-7 text-muted-foreground">Uma rotina de cuidado é feita de pequenos momentos. Organize esse acompanhamento para participar com mais clareza.</p></div>
          <ol className="space-y-6">{[
            ['Crie sua conta', 'Dê o primeiro passo pelo cadastro na plataforma.'],
            ['Conheça seu espaço de cuidado', 'Acesse a área da família ou do cuidador para acompanhar a rotina.'],
            ['Acompanhe o dia a dia', 'Consulte anotações, atividades e informações do cuidado em um só lugar.'],
          ].map(([title, text], index) => <li key={title} className="flex gap-4 border-b border-border pb-6"><span className="grid size-10 shrink-0 place-items-center rounded-full border border-border font-heading text-lg font-semibold text-primary">0{index + 1}</span><div><h3 className="font-heading text-xl font-semibold text-primary">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div></li>)}</ol>
        </section>

        <section className="bg-primary px-5 py-14 text-primary-foreground">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 lg:flex-row lg:items-center lg:px-8"><div><h2 className="font-heading text-3xl font-semibold sm:text-4xl">Mais presença em cada cuidado.</h2><p className="mt-3 leading-7">Comece uma nova forma de acompanhar quem faz parte da sua vida.</p></div><Button asChild size="lg" className="h-12 bg-background text-primary shadow-none hover:bg-secondary"><Link to="/cadastro">Criar minha conta <ArrowRight aria-hidden="true" /></Link></Button></div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8"><Link to="/" aria-label="Promedéri — início"><Brand /></Link><p className="text-sm text-muted-foreground">Cuidado que conecta famílias e cuidadores.</p><Link to="/login" className="text-sm font-semibold text-primary hover:underline">Acessar minha conta</Link></footer>
    </div>
  );
}
