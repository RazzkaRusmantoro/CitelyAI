"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProfileComponent() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    full_name: "",
    institution: "",
    field_of_study: "",
    citation_style: "apa",
    avatar_url: "",
  });
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Get current user session
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setEmail(user.email || "");

        // Fetch profile data
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (profileData) {
          setProfile({
            full_name: profileData.full_name || "",
            institution: profileData.institution || "",
            field_of_study: profileData.field_of_study || "",
            citation_style: profileData.citation_style || "apa",
            avatar_url: profileData.avatar_url || "",
          });

          if (profileData.avatar_url) {
            const { data: avatarData } = await supabase.storage
              .from("avatars")
              .createSignedUrl(profileData.avatar_url, 3600);

            if (avatarData?.signedUrl) {
              setAvatarPreview(avatarData.signedUrl);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [supabase, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleCitationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile((prev) => ({ ...prev, citation_style: e.target.id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      let avatarPath = profile.avatar_url;

      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        if (avatarPath) {
          await supabase.storage.from("avatars").remove([avatarPath]);
        }

        avatarPath = filePath;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.full_name,
        institution: profile.institution,
        field_of_study: profile.field_of_study,
        citation_style: profile.citation_style,
        avatar_url: avatarPath,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center gap-6">
        <Avatar className="w-20 h-20">
          <AvatarImage src={avatarPreview || "/avatars/default.png"} />
          <AvatarFallback>
            {profile.full_name ? profile.full_name.substring(0, 2) : "CN"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          <Label htmlFor="avatar-upload" className="mt-2 cursor-pointer">
            <Button asChild variant="outline" size="sm">
              <span>Change Avatar</span>
            </Button>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={profile.full_name}
            onChange={handleInputChange}
            placeholder="Abdur Rahman"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="abdur@example.com"
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            value={profile.institution}
            onChange={handleInputChange}
            placeholder="University of WollongCock"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="field_of_study">Field of Study</Label>
          <Input
            id="field_of_study"
            value={profile.field_of_study}
            onChange={handleInputChange}
            placeholder="Computer Science"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold">Citation Preferences</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="apa"
              name="citation-style"
              checked={profile.citation_style === "apa"}
              onChange={handleCitationChange}
            />
            <Label htmlFor="apa">APA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="mla"
              name="citation-style"
              checked={profile.citation_style === "mla"}
              onChange={handleCitationChange}
            />
            <Label htmlFor="mla">MLA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="chicago"
              name="citation-style"
              checked={profile.citation_style === "chicago"}
              onChange={handleCitationChange}
            />
            <Label htmlFor="chicago">Chicago</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="harvard"
              name="citation-style"
              checked={profile.citation_style === "harvard"}
              onChange={handleCitationChange}
            />
            <Label htmlFor="harvard">Harvard</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-8">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
