import {inngest} from "./client";
import {fetchAllNews, formatNewsSummary} from "@/lib/rss_utils";
import { Resend } from 'resend';

export const helloWorld = inngest.createFunction(
    {id: "hello-world"},
    {event: "test/hello.world"},
    async ({event, step}) => {
        await step.sleep("wait-a-moment", "1s");
        return {message: `Hello ${event.data.email}!`};
    },
);

export const sendDailyNews = inngest.createFunction(
    {id: "send-daily-news"},
    { cron: "TZ=Asia/Shanghai 50 22 * * *" },
    async ({event, step}) => {
        // 1.从多个RSS源获取新闻
        const newsItems = await step.run("fetch-news", async () => {
            console.log("Fetching news...");
            const news = await fetchAllNews();
            console.log("News fetched:", news.length);
            return news
        });

        // 2.整理新闻为每日摘要
        const newsSummary = await step.run("format-news", async () => {
            console.log("Formatting news...");
            const summary = formatNewsSummary(newsItems);
            console.log("News formatted:", summary);
            return summary;
        });

        // 3.创建邮件内容
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error: createError } = await step.run("create-email", async () => {
            console.log("Create email...");
            const result = await resend.broadcasts.create({
                from: "Daily News <test@tecent.icu>",
                segmentId: "3a9ea3ad-cc70-4d88-b350-2399df652bcf",
                subject: `Daily Brief - ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}`,
                html: newsSummary.html,
            });
            return result;
        });
        if (createError) {
            console.log("Error create email: ", createError);
            return {error: createError.message};
        }

        // 4.发送邮件
        const {error: sendError} = await step.run("send-email", async () => {
            console.log("Sending email...");
            const result = await resend.broadcasts.send(data?.id ?? "");
            return result;
        });

        if (sendError) {
            console.log("Error sending email: ", sendError);
            return {error: sendError.message};
        }
        return {message: "Email send successfully."};
    },
);