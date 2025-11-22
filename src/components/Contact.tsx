import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { FaTelegram, FaFacebookMessenger, FaGithub } from "react-icons/fa";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { contactSchema } from "@/lib/validations";
import { z } from "zod";
import { motion } from "framer-motion";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "vitlaicodedao@gmail.com",
      link: "mailto:vitlaicodedao@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "0935169835",
      link: "tel:0935169835",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Ho Chi Minh, Vietnam",
      link: "#",
    },
  ];

  const socialLinks = [
    {
      icon: FaTelegram,
      name: "Telegram",
      link: "https://t.me/pikapika2101",
    },
    {
      icon: FaFacebookMessenger,
      name: "Facebook",
      link: "https://facebook.com/tranviet0710",
    },
    {
      icon: FaGithub,
      name: "GitHub",
      link: "https://github.com/tranviet0710",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSuccess(false);

    try {
      const validatedData = contactSchema.parse(formData);
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from("support_requests")
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone || null,
          message: validatedData.message,
          status: "pending",
        })
        .select(); // Add .select() to return the inserted data

      if (error) throw error;

      // After successful insertion, invoke the notification function
      const { error: functionError } = await supabase.functions.invoke(
        "support-request-notify",
        {
          body: {
            supportRequest: {
              ...validatedData,
              id: data[0].id, // Pass the actual ID from the inserted data
            },
          },
        }
      );

      setIsSuccess(true);
      toast({
        title: t("contact.successTitle"),
        description: t("contact.successMessage"),
        className: "bg-background border-primary",
      });

      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error("Error submitting form:", error);
        toast({
          title: t("contact.errorTitle"),
          description: t("contact.errorMessage"),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "3rem 3rem",
            animation: "zoom 30s infinite linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-heading">
            {t("contact.title")}{" "}
            <span className="text-primary">{t("contact.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-8"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 font-heading">
                {t("contact.infoTitle")}
              </h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.link}
                      className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-primary/20 hover:border-primary/50 transition-all duration-300 group"
                      style={{ backdropFilter: "blur(10px)" }}
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                        <Icon
                          className="w-6 h-6 text-primary"
                          style={{
                            filter: `drop-shadow(0 0 5px hsla(var(--primary), 0.7))`,
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">
                          {method.title}
                        </p>
                        <p className="font-semibold">{method.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6 font-heading">
                {t("contact.socialTitle")}
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-14 h-14 rounded-full bg-background/50 border-2 border-primary/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary group"
                      title={social.name}
                    >
                      <Icon
                        className="w-6 h-6 text-primary/80 group-hover:text-primary transition-colors"
                        style={{
                          filter: `drop-shadow(0 0 5px hsla(var(--primary), 0.7))`,
                        }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative p-8 bg-background/50 border border-primary/20 rounded-xl"
            style={{ backdropFilter: "blur(10px)" }}
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-px bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-md"></div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-6 font-heading">
                {t("contact.formTitle")}
              </h3>

              {isSuccess && (
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="text-sm text-primary">
                    {t("contact.successMessage")}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`bg-background/70 focus:bg-background transition-all ${
                      errors.name
                        ? "border-destructive"
                        : "border-primary/30 focus:border-primary"
                    }`}
                    placeholder={t("contact.name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`bg-background/70 focus:bg-background transition-all ${
                      errors.email
                        ? "border-destructive"
                        : "border-primary/30 focus:border-primary"
                    }`}
                    placeholder={t("contact.email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="bg-background/70 focus:bg-background transition-all border-primary/30 focus:border-primary"
                    placeholder={t("contact.phone")}
                  />
                </div>
                <div>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`bg-background/70 focus:bg-background resize-none transition-all ${
                      errors.message
                        ? "border-destructive"
                        : "border-primary/30 focus:border-primary"
                    }`}
                    placeholder={t("contact.message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary text-primary-foreground group shadow-[0_0_20px_hsla(var(--primary),0.4)] hover:shadow-[0_0_30px_hsla(var(--primary),0.6)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("contact.sending") : t("contact.send")}
                  <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
