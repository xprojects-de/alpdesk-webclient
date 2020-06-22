import { IWorklog } from './iworklog';

export interface IJiraIssue {
    id: number;
    key: string;
    summary: string;
    issuetype: any;
    status: any;
    duedatetime: number;
    duedate: string;
    link: string;
    completeHours: string;
    completeprices: string;
    jiraMoneyPerHour: string;
    worklogs: IWorklog[];
}
