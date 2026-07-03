import { tickets } from "../data/chamados";

export function getTickets() {
  if (typeof window === "undefined") {
    return tickets;
  }

  const ticketsLocais = JSON.parse(
    localStorage.getItem("chamados") || "[]"
  );

  const ticketsEditados = JSON.parse(
    localStorage.getItem(
      "tickets_editados"
    ) || "[]"
  );

  const ticketsBase =
    tickets.map((ticket) => {
      const editado =
        ticketsEditados.find(
          (e: any) =>
            String(e.id) ===
            String(ticket.id)
        );

      return editado
        ? {
            ...ticket,
            ...editado,
          }
        : ticket;
    });

  return [
    ...ticketsBase,
    ...ticketsLocais,
  ];
}

export function getTicketById(
  id: string
) {
  const todosTickets =
    getTickets();

  return todosTickets.find(
    (ticket) =>
      String(ticket.id) ===
      String(id)
  );
}

export function isLocalTicket(
  id: string
) {
  const ticketsLocais =
    JSON.parse(
      localStorage.getItem(
        "chamados"
      ) || "[]"
    );

  return ticketsLocais.some(
    (ticket: any) =>
      String(ticket.id) ===
      String(id)
  );
}

export function deleteTicket(
  id: string
) {
  const ticketsLocais =
    JSON.parse(
      localStorage.getItem(
        "chamados"
      ) || "[]"
    );

  const atualizados =
    ticketsLocais.filter(
      (ticket: any) =>
        String(ticket.id) !==
        String(id)
    );

  localStorage.setItem(
    "chamados",
    JSON.stringify(
      atualizados
    )
  );
}

export function updateTicket(
  id: string,
  dados: any
) {
  const ticketsLocais =
    JSON.parse(
      localStorage.getItem(
        "chamados"
      ) || "[]"
    );

  const ticketExisteLocal =
    ticketsLocais.some(
      (ticket: any) =>
        String(ticket.id) ===
        String(id)
    );

  if (ticketExisteLocal) {
    const atualizados =
      ticketsLocais.map(
        (ticket: any) =>
          String(ticket.id) ===
          String(id)
            ? {
                ...ticket,
                ...dados,
              }
            : ticket
      );

    localStorage.setItem(
      "chamados",
      JSON.stringify(
        atualizados
      )
    );

    return;
  }

  const ticketsEditados =
    JSON.parse(
      localStorage.getItem(
        "tickets_editados"
      ) || "[]"
    );

  const indice =
    ticketsEditados.findIndex(
      (ticket: any) =>
        String(ticket.id) ===
        String(id)
    );

  if (indice >= 0) {
    ticketsEditados[
      indice
    ] = {
      ...ticketsEditados[
        indice
      ],
      ...dados,
    };
  } else {
    ticketsEditados.push({
      id,
      ...dados,
    });
  }

  localStorage.setItem(
    "tickets_editados",
    JSON.stringify(
      ticketsEditados
    )
  );
}