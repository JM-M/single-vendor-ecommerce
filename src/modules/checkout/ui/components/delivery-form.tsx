import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  NG_CITY_DELIVERY_PRICES,
  NG_STATE_DELIVERY_PRICES,
  NG_STATES,
} from "../../constants";
import { useCheckout } from "../../hooks/use-checkout";
import { usePurchase } from "../../hooks/use-purchase";
import { checkoutDeliveryFormSchema } from "../../schema";

export const DeliveryForm = () => {
  const { checkout } = useCheckout();
  const { purchase } = usePurchase();
  const { setDelivery } = useCheckout();

  const { data, isFetching } = checkout;

  const form = useForm<z.infer<typeof checkoutDeliveryFormSchema>>({
    resolver: zodResolver(checkoutDeliveryFormSchema),
    defaultValues: {
      email: "", // TODO: Autopopulate email if they are logged in. Also allow them to switch accounts.
      fullName: "",
      address: "",
      phone: "",
      specialNotes: "",
      state: "",
      city: "",
    },
  });

  const state = form.watch("state");
  const city = form.watch("city");
  const email = form.watch("email");
  useEffect(() => {
    // This runs whenever any field changes
    setDelivery({ state, city, email });
  }, [state, city, email, setDelivery]);

  const stateComboboxOptions = NG_STATES.filter(
    (state) =>
      typeof NG_STATE_DELIVERY_PRICES[
        state.code as keyof typeof NG_STATE_DELIVERY_PRICES
      ] === "number",
  ).map((state) => ({
    value: state.code,
    label: state.name,
  }));

  const stateCitiesOptions = useMemo(() => {
    if (!state) return [];

    const cities =
      NG_CITY_DELIVERY_PRICES[state as keyof typeof NG_CITY_DELIVERY_PRICES];

    if (!Array.isArray(cities)) return [];

    return cities
      .map((cityObj) => ({
        value: cityObj?.city as string,
        label: cityObj?.city as string,
      }))
      .filter((v) => !!v);
  }, [state]);

  return (
    <Form {...form}>
      <form className="space-y-3 p-4" onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                {/* TODO: Make this disabled if they are logged in */}
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput {...field} defaultCountry="NG" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Combobox
                    {...field}
                    onChange={(value) => {
                      field.onChange(value);
                      form.setValue("city", "");
                    }}
                    options={stateComboboxOptions}
                    searchPlaceholder="Search states"
                    emptySelectContent="Select state"
                    emptySearchContent="No state found"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!!stateCitiesOptions.length && (
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Combobox
                      {...field}
                      value={field.value || ""}
                      options={stateCitiesOptions}
                      searchPlaceholder="Search cities"
                      emptySelectContent="Select city"
                      emptySearchContent="No city found"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your full delivery address."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information you would like us to know regarding the delivery of your order."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
