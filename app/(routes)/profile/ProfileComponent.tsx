import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { getUser } from "@/app/auth/getUser";

export async function ProfileComponent() {
  const user = await getUser();
  const userId = user?.id;
  
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    citation_style: "apa",
  });
  const [email, setEmail] = useState("user@example.com");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      setProfile({
        full_name: "John Doe",
        citation_style: "apa"
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, full_name: e.target.value }));
  };

  const handleCitationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, citation_style: e.target.id }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock save operation
    setTimeout(() => {
      setLoading(false);
      setIsEditingName(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <div className="flex gap-2">
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={handleNameChange}
              placeholder="Your Name"
              disabled={!isEditingName}
            />
            {!isEditingName ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setIsEditingName(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingName(false)}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
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