import { useEffect, useState } from "react";
import type { Exam } from "~/types/Users";
import { exams } from "~/mocks/mock";
import List from "~/components/List";
import { Check } from "@mui/icons-material";
import Button from "~/components/Button";
import { generatePath, Link, useParams } from "react-router";
import { ROUTES } from "~/routes/EnumRoutes";
import { Modal } from "@mui/material";
import AttachExam from "~/components/Exam/AttachExam";

function ExamPage() {

    const { examId } = useParams();

    const [userId, setUserId] = useState<number>(1);
    const [userExams, setUserExams] = useState<Exam[]>([]);
    const [exam, setExam] = useState<Exam | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [openAttachExam, setOpenAttachExam] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const data = exams.filter((e) => e.patient_id === userId);
        setUserExams(data);

        if (examId) {
            const found = data.find((e) => e.id === Number(examId));
            setExam(found ?? null);
        } else {
            setExam(null);
        }

        setLoading(false);
    }, [examId]);

    const handleFilterExams = (status: string) => {
        if (status === "all") {
            setUserExams(exams.filter(exam => exam.patient_id === userId));
        }
        else {
            setUserExams(exams.filter(exam => exam.patient_id === userId && exam.status === status));
        }
    }

    if (loading) {
        return <p className="p-4 text-gray-500">Carregando exames…</p>;
    }

    if (exam) {
        return (
            <div className="p-4 space-y-4">
                <Button to={ROUTES.CAREGIVER.EXAMINATION.replace(":examId", "")}>
                    ← Voltar
                </Button>
                <div className="flex flex-col gap-3 border border-gray-100 rounded-lg p-4 h-full mt-5">
                    <h1 className="text-2xl font-bold">{exam.title}</h1>
                    <p><strong>Data:</strong> {exam.date ? new Date(exam.date).toLocaleDateString() : "—"}</p>
                    <p><strong>Status:</strong> {exam.status}</p>
                    <p><strong> {exam.description} </strong></p>
                    <Button type="button" onClick={() => setOpenAttachExam(true)}> Anexar Exames </Button>
                </div>

                <Modal
                    open={openAttachExam}
                    onClose={() => setOpenAttachExam(false)}
                    className="flex items-center justify-center"
                    aria-labelledby="attach-exam-modal-title"
                    aria-describedby="attach-exam-modal-description"
                >
                    <AttachExam onComplete={() => {}} onClose={() => setOpenAttachExam(false)} />
                </Modal>
            </div>
        );
    }


    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold text-black">Exames</h1>
            <p className="text-gray-600">Selecione um exame para ver os detalhes.</p>
            <div>
                <Button type="button" onClick={() => handleFilterExams("all")} className="mr-2">
                    Todos
                </Button>
                <Button type="button" onClick={() => handleFilterExams("completed")} className="mr-2">
                    Concluídos
                </Button>
                <Button type="button" onClick={() => handleFilterExams("pending")} className="mr-2">
                    Pendentes
                </Button>
            </div>
            <div className="flex flex-col gap-3 border border-gray-100 rounded-lg p-4 h-full">
                {userExams.length > 0 ? (
                    userExams.map((exam) => (
                        <List.ItemRoot>
                            <Link
                                to={generatePath(ROUTES.CAREGIVER.EXAMINATION, { examId: String(exam.id) })}
                                className="flex w-full items-center justify-between p-4 hover:bg-gray-50"
                            >
                                <List.ItemContent
                                    title={exam.title}
                                    description={exam.date ? new Date(exam.date).toLocaleDateString() : "Data não disponível"}
                                    className="p-4"
                                />
                                <List.ItemIcon>
                                    {exam.status === "completed" ? (
                                        <Check />
                                    ) : (
                                        <div className="p-3 h-6 bg-green-100 rounded-2xl flex items-center justify-center">
                                            <span className="text-black">Novo</span>
                                        </div>
                                    )}
                                </List.ItemIcon>
                            </Link>
                        </List.ItemRoot>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhum exame encontrado.</p>
                )}
            </div>
        </div>
    )
}

export default ExamPage;