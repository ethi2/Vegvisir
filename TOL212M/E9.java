// Author: Snorri Agnarsson, snorri@hi.is

// Java lists without side effects.

public class E9
{
	// Instances of Link are immutable links with a
	// head that is an integer and a tail that is a
	// finite chain of links. Note that there is no
	// possibility to change the tail and therefore
	// al chains are finite. An empty chain is denoted
	// by null.
	public static class Link
	{
		private final int head;
		private final Link tail;
		
		// Usage:  E9.Link x = new E9.Link(head,tail);
		// Pre:    head is an int, tail is an E9.Link (may be null).
		// Post:   x refers to a new E9.Link with the given head and
		//         tail.
		public Link( int head, Link tail )
		{
			this.head = head;
			this.tail = tail;
		}
		
		// Usage:  int h = link.head();
		// Pre:    link refers to an E9.Link object.
		// Post:   h contains the head of link.
		public int head()
		{
			return head;
		}
		
		// Usage:  E9.Link t = link.tail();
		// Pre:    link refers to an E9.Link object.
		// Post:   t contains the tail of link.
		public Link tail()
		{
			return tail;
		}
	}
	
	// Usage:  E9.Link x = E9.cons(head,tail);
	// Pre:    head is an int, tail is an E9.Link (may be null).
	// Post:   x refers to a new E9.Link with the given head and
	//         tail.
	public static Link cons( int h, Link t )
	{
		return new Link(h,t);
	}
	
	// Usage:  int h = E9.head(x);
	// Pre:    link refers to an E9.Link object.
	// Post:   h contains the head of x.
	public static int head( Link x )
	{
		return x.head();
	}
	
	// Usage:  E9.Link t = tail(x);
	// Pre:    x refers to an E9.Link object.
	// Post:   t contains the tail of x.
	public static Link tail( Link x )
	{
		return x.tail();
	}
		
	// Usage:  int n = E9.length(x);
	// Pre:    x is an E9.Link, may be null.
	// Eftir:  n is the number of links in the chain x.
	public static int length( E9.Link x )
	{
		//... use a loop to implement this body
		int nc = 0;
		E9.Link tr = x;
		while(tr != null)
		//nc is a count of the links in the chain passed over
		//(to the "left" of tr)
		{
			nc++;
			tr = tail(tr);
		}
		return nc;
	}

	// Usage:  int i = E9.nth(x,n);
	// Pre:    n>=0, x is a chain with at least n+1 links.
	// Post:   i is the head of the n-th link in the chain
	//         where the 0-th link is the first link.
	public static int nth( E9.Link x, int n )
	{
		assert n>=0;
		assert x != null;
		//... use a loop to implement this body
		E9.Link tr = x;
		for(int i=0;i<n;i++)
		{
			tr = tail(tr);
		}
		return E9.head(tr);
	}
	
	// Usage:  E9.Link x = makeChain(a);
	// Pre:    a refers to an int[]. Must not be null,
	//         but may be empty.
	// Post:   x is a chain that contains the values in a
	//         such that for i=0,...,a.length-1 we have
	//         E9.nth(x,i) == a[i].
	public static Link makeChain( int[] a )
	{
		assert a != null;
		//... use a loop to implement this body
		E9.Link skil = null;
		int AW = a.length - 1;
		//skil is a chain of all the links that this loop has created
		//their values are the values in the array a above the index AW
		//AW indexes which part of the array to handle next
		while(AW >= 0)
		{
			skil = new E9.Link(a[AW],skil);
			AW--;
		}
		assert AW == -1;
		return skil;
	}
	
	// Usage:  int i = E9.last(x);
	// Pre:    x refers to a E9.Link, must not be null.
	// Post:   i is the value in (the head of) the last
	//         link in x.
	public static int last( Link x )
	{
		assert x != null;
		//... use a loop to implement this body
		E9.Link tr = x;
		//tr is a link in chain x
		while(tail(tr) != null)
		{
			tr = tail(tr);
		}
		return E9.head(tr);
	}

	// Usage:  E9.Link z = E9.removeLast(x);
	// Pre:    x refers to a E9.Link, must not be null.
	// Post:   z is a chain of new links such that
	//         E9.length(z) == E9.length(x)-1
	//         and for i=0,...,E9.length(z)-1 we have
	//         E9.nth(z,i) == E9.nth(x,i).
	public static Link removeLast( Link x )
	{
		assert x != null;
		//... use a loop to implement this body
		final int Ll = E9.length(x)-1;
		assert Ll >= 0;
		int bu[] = new int[Ll];
		E9.Link digger = x;
		//this loop fills bu with the values of chain x except for the last link
		//i denotes how many links have been handled
		for(int i=0;i<Ll;)
		{
			bu[i] = E9.head(digger);
			digger = tail(digger);
			i++;
		}
		return makeChain(bu);
	}
	
	// Usage:  E9.Link r = E9.reverse(x);
	// Pre:    x is a chain, may be empty.
	// Post:   z is a new chain of equal length to x, such
	//         that for i=0,...,E9.length(x)-1 we have
	//         E9.nth(x,i) == E9.nth(r,E9.length(x)-i-1).
	public static Link reverse( Link x )
	{
		//... use a loop to implement this body
		final int Ll = E9.length(x);
		int bu[] = new int[Ll];
		E9.Link digger = x;
		//this loop fills bu with the values of chain x in "reverse"
		//such that the first value in the chain is last in the array and vice versa
		for(int i = Ll-1;i>=0;)
		{
			bu[i] = E9.head(digger);
			digger = tail(digger);
			i--;
		}
		return makeChain(bu);
	}

	// Run the command
	//   java E9 1 2 3 4
	// and show what the program writes
	public static void main( String[] args )
	{
		E9.Link x = null;
		for( int i=0 ; i!=args.length ; i++ )
			x = E9.cons(Integer.parseInt(args[i]),x);
		while( x != null )
		{
			E9.Link z = reverse(x);
			x = z;
			while( z != null )
			{
				System.out.print(z.head); System.out.print(" ");
				z = z.tail;
			}
			x = removeLast(x);
			System.out.println();
		}
	}
}