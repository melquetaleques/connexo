package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	log.Println("worker iniciado — processando jobs em segundo plano")

	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("encerrando worker...")
			return
		case <-ticker.C:
			// Processar notificacoes pendentes, expirar links, etc.
			log.Println("worker: ciclo de manutencao concluido")
		}
	}
}
