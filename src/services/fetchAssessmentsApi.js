const apiPath = import.meta.env.VITE_BACKEND_HOST;

export const createAssessmentService = async (assessmentData, token) => {
    try {
        const response = await fetch(`${apiPath}/assessments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(assessmentData),
        });

        const responseData = await response.json();

        // Extraer status y message/messages (puede venir en singular o plural)
        const { status, message, messages } = responseData;
        const responseMessage = messages || message || 'Operación completada';

        // Verificar si el status es "ok" o "Ok" (aceptar ambos)
        if (!response.ok || (status !== 'ok' && status !== 'Ok')) {
            throw new Error(responseMessage || 'Error al enviar la valoración');
        }

        return { success: true, message: responseMessage };
    } catch (error) {
        console.error('Error en createAssessmentService:', error);
        throw error;
    }
};

export const deleteAssessmentService = async (assessmentId, token) => {
    try {
        const response = await fetch(`${apiPath}/assessments/${assessmentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(
                responseData.message || 'Error al eliminar la valoración'
            );
        }

        return responseData.message || 'Valoración eliminada correctamente';
    } catch (error) {
        console.error('Error en deleteAssessmentService:', error);
        throw error;
    }
};

export const getAssessmentsService = async () => {
    try {
        const response = await fetch(`${apiPath}/assessments`);

        // Si es 404, significa que no hay valoraciones, devolvemos un array vacío
        if (response.status === 404) {
            console.log('No hay valoraciones disponibles aún');
            return {
                message: 'No hay valoraciones disponibles aún',
                count: 0,
                result: [],
                noAssessments: true, // Flag para indicar que no hay valoraciones
            };
        }

        const responseData = await response.json();

        const { status, message, data } = responseData;

        // Verificar si el status es "ok" o "Ok" (aceptar ambos)
        if (!response.ok || (status !== 'ok' && status !== 'Ok')) {
            throw new Error(message || 'Error al obtener las valoraciones');
        }

        // Devolver un objeto con la estructura esperada por la página
        return {
            message,
            count: responseData.count || 0,
            result: data || [], // Mantener la propiedad 'result' para compatibilidad
        };
    } catch (error) {
        // Si es un error diferente a 404, lo propagamos
        if (error.message !== 'No hay valoraciones disponibles aún') {
            console.error('Error en getAssessmentsService:', error);
            throw error;
        }
        // Si llegamos aquí con el mensaje de 404, devolvemos el resultado vacío
        return {
            message: 'No hay valoraciones disponibles au00fan',
            count: 0,
            result: [],
            noAssessments: true,
        };
    }
};
