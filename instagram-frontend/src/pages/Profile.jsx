import './Profile.css'

function Profile() {
    return (
        <>
        <div className="container-fluid">
            <div id="conteudo" className="sm:container" style={{maxWidth: "1000px"}}>
                <div id="cabecalho">
                    <div id="fotodeperfil">
                        <div id="fotobox">
                            <img src='https://placehold.co/200x200' alt="Foto de Perfil" />
                        </div>
                    </div>
                    <div id="textodeperfil">
                        <h2 id="username">digitalcollegebr</h2>

                        <b id="nomedeperfil">
                            &gt; Digital College • Fortaleza/CE _
                        </b>    

                        <div id="seguidores">
                            <span id="seguidores-texto"><b>100 mil</b> Seguidores</span>
                            <span><b>3.004</b> Seguindo</span>
                        </div>

                        <div id="bio">
                            <div id="p" class="bioline">🏆| Maior escola de IA e habilidades digitais do Brasil.</div>
                            <div id="p" class="bioline">🧑‍💻| + de 10000 alunos atendidos.</div>
                            <div id="p" class="bioline">🤝| + 80% de empregabilidade.</div>
                            <div id="p" class="bioline">👇| Vem ser COLLEGER |👇</div>

                            <a id="biolinnk" href="https://bio.digitalcollege.com.br">
                                <svg aria-label="Ícone de link" class="x1lliihq x1n2onr6 x7l2uk3" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Ícone de link</title><path d="m9.726 5.123 1.228-1.228a6.47 6.47 0 0 1 9.15 9.152l-1.227 1.227m-4.603 4.603-1.228 1.228a6.47 6.47 0 0 1-9.15-9.152l1.227-1.227" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="8.471" x2="15.529" y1="15.529" y2="8.471"></line></svg>
                                bio.digitalcollege.com.br
                            </a>
                        </div>

                        <button id="followb">Seguir</button>

                    </div>
                </div>
                {/* <div id="destaques">
                    <GenDestaques quantos={10} />
                </div>
                <Feed images={10000} /> */}
            </div>
        </div>
        </>
    )
}

export default Profile