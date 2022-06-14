export default function Home() {
    return (
        <>
            <div className="container mt-3">
                <div className="card" aria-hidden="true">
                    <div className="card-title h3">Home</div>
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                            <span className="placeholder col-6" />
                        </h5>
                        <p className="card-text placeholder-glow">
                            <span className="placeholder col-7" />
                            <span className="placeholder col-4" />
                            <span className="placeholder col-4" />
                            <span className="placeholder col-6" />
                            <span className="placeholder col-8" />
                        </p>
                        <a
                            href="#"
                            tabIndex={-1}
                            className="btn btn-primary disabled placeholder col-6"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
